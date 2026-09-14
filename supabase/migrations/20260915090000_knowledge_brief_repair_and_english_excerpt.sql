-- Knowledge public feed: repair generated Korean briefs and add an English excerpt.
--
-- 1. Generated card summaries arrive with decimals split by a space ("96. 7일",
--    "AUC=0. 97") and, in some rows, cut off after a bare number ("aRR 1.").
--    The public feed now re-joins split decimals and trims a dangling numeric
--    fragment back to the last complete sentence (or marks the cut with "…").
-- 2. The English page previously showed the Korean brief. When the paper's
--    license allows abstract reuse and the abstract is not Korean, the feed now
--    carries a bounded English excerpt in `brief_en`.

alter table public.viore_knowledge_public_papers
  add column if not exists brief_en text;

alter table public.viore_knowledge_public_papers
  drop constraint if exists viore_knowledge_public_papers_brief_en_length;

alter table public.viore_knowledge_public_papers
  add constraint viore_knowledge_public_papers_brief_en_length
    check (brief_en is null or char_length(brief_en) between 20 and 500);

comment on column public.viore_knowledge_public_papers.brief_en is
  'License-permitted English abstract excerpt for the English Knowledge page; null when unavailable.';

create or replace function private.viore_knowledge_repair_brief(source_text text)
returns text
language plpgsql
immutable
strict
set search_path = ''
as $$
declare
  joined text;
  complete_sentence text;
begin
  -- "96. 7일" / "AUC=0. 97" -> "96.7일" / "AUC=0.97"
  joined := regexp_replace(source_text, '([0-9])\. ([0-9])', '\1.\2', 'g');

  -- A brief that ends with a bare number and a period was cut mid-sentence.
  if joined !~ '[0-9]\.[[:space:]]*$' then
    return joined;
  end if;

  complete_sentence := substring(joined from '^(.*[다요음임함됨죠네까][.!?])');
  if complete_sentence is not null and char_length(complete_sentence) >= 60 then
    return trim(complete_sentence);
  end if;

  return rtrim(regexp_replace(joined, '[[:space:]]*[^[:space:]]+[[:space:]]*$', '')) || '…';
end;
$$;

create or replace function private.viore_knowledge_english_excerpt(source_text text)
returns text
language plpgsql
immutable
strict
set search_path = ''
as $$
declare
  excerpt text;
begin
  excerpt := private.viore_knowledge_excerpt(source_text);
  if excerpt is null then
    return null;
  end if;

  excerpt := regexp_replace(excerpt, '^(abstract|summary)[[:space:]:.\-–—]+', '', 'i');
  excerpt := trim(excerpt);

  if char_length(excerpt) < 20 or char_length(excerpt) > 500 or excerpt ~ '[가-힣]' then
    return null;
  end if;

  return excerpt;
end;
$$;

create or replace function private.refresh_viore_knowledge_public_papers()
returns void
language plpgsql
security definer
set search_path = ''
set statement_timeout = '180s'
as $$
begin
  delete from public.viore_knowledge_public_papers;

  insert into public.viore_knowledge_public_papers (
    paper_id,
    published_date,
    title,
    title_ko,
    brief,
    brief_en,
    brief_kind,
    authors,
    author_count,
    journal,
    published_year,
    source,
    scope,
    href,
    data_as_of,
    refreshed_at
  )
  with latest_ready_summary as (
    select distinct on (summary.document_id)
      summary.document_id,
      summary.card_summary,
      summary.updated_at as summary_updated_at
    from public.document_card_summaries as summary
    where summary.document_kind = 'paper'
      and summary.status = 'ready'
      and summary.license_tier in ('safe_open', 'metadata_only')
    order by summary.document_id, summary.updated_at desc
  ), prepared as (
    select
      paper.id as paper_id,
      paper.published_date,
      trim(paper.title) as title,
      left(nullif(trim(paper.title_ko), ''), 500) as title_ko,
      case
        when char_length(trim(summary.card_summary)) between 60 and 4000
          and left(summary.card_summary, 240) ~ '[가-힣]'
          and summary.card_summary not ilike '%준비 중%'
          then summary.card_summary
        when private.viore_knowledge_abstract_allowed(paper.license)
          and nullif(trim(paper.abstract_ko), '') is not null
          and paper.abstract_ko ~ '[가-힣]'
          then paper.abstract_ko
        when private.viore_knowledge_abstract_allowed(paper.license)
          and nullif(trim(paper.abstract), '') is not null
          and paper.abstract ~ '[가-힣]'
          then paper.abstract
        else null
      end as raw_brief,
      case
        when private.viore_knowledge_abstract_allowed(paper.license)
          then coalesce(nullif(trim(paper.abstract_en), ''), nullif(trim(paper.abstract), ''))
        else null
      end as raw_brief_en,
      case
        when char_length(trim(summary.card_summary)) between 60 and 4000
          and left(summary.card_summary, 240) ~ '[가-힣]'
          and summary.card_summary not ilike '%준비 중%'
          then 'generated'
        else 'abstract'
      end as brief_kind,
      coalesce(
        array(
          select left(trim(author_name), 200)
          from unnest(coalesce(paper.authors[1:3], array[]::text[]))
            with ordinality as listed_author(author_name, author_order)
          where nullif(trim(author_name), '') is not null
          order by author_order
        ),
        array[]::text[]
      ) as authors,
      coalesce(cardinality(paper.authors), 0) as author_count,
      left(nullif(trim(paper.journal), ''), 300) as journal,
      extract(year from paper.published_date)::integer as published_year,
      paper.source,
      case
        when paper.source in ('kci', 'kmbase_publicdata', 'kamje')
          or paper.language in ('ko', 'kor')
          or nullif(trim(paper.title_ko), '') is not null
          then 'domestic'
        else 'overseas'
      end as scope,
      case
        when paper.source_url ~ '^https://[^[:space:]]+$' then paper.source_url
        when paper.pmid ~ '^[0-9]+$' then 'https://pubmed.ncbi.nlm.nih.gov/' || paper.pmid || '/'
        when paper.pmcid ~ '^PMC[0-9]+$' then 'https://pmc.ncbi.nlm.nih.gov/articles/' || paper.pmcid || '/'
        when paper.doi is not null and paper.doi !~ '[[:space:]]' then 'https://doi.org/' || paper.doi
        else null
      end as href,
      lower(
        regexp_replace(
          trim(coalesce(nullif(paper.title_ko, ''), paper.title)),
          '[[:space:]]+',
          ' ',
          'g'
        )
      ) as title_key,
      greatest(
        coalesce(paper.last_synced_at, paper.created_at),
        coalesce(summary.summary_updated_at, 'epoch'::timestamptz)
      ) as data_as_of,
      paper.created_at,
      summary.summary_updated_at
    from public.papers as paper
    left join latest_ready_summary as summary
      on summary.document_id = paper.id
    where paper.source in (
        'kci',
        'pubmed',
        'pmc',
        'europepmc',
        'kmbase_publicdata',
        'kamje',
        'doaj',
        'medrxiv',
        'manual'
      )
      and paper.specialty is not null
      and (
        paper.source <> 'kci'
        or (
          coalesce(paper.subject_area, '') ~ '(의학|내과|외과|간호|치의학|한의학|보건|병리|해부|생리학|재활|작업치료|물리치료|방사선|응급|감염|소아|산부인|정신과|신경|임상|약학|약품학|건강증진|의료|운동.*처방|(^|/)역학($|/))'
          and coalesce(paper.subject_area, '') !~ '(수의학|농학)'
        )
      )
      and coalesce(paper.date_status, 'normal') not in ('future', 'invalid')
      and paper.published_date is not null
      and paper.published_date <= current_date
      and char_length(trim(paper.title)) between 8 and 500
      and lower(paper.title) !~ '(farmyard|manure|cotton|gossypium|armyworm|spodoptera|veterinary|canine|dog breed|alfalfa|wheatgrass|bovine|beef)'
  ), excerpted as (
    select
      prepared.*,
      private.viore_knowledge_repair_brief(private.viore_knowledge_excerpt(prepared.raw_brief)) as brief,
      case
        when prepared.raw_brief_en is not null and prepared.raw_brief_en !~ '[가-힣]'
          then private.viore_knowledge_english_excerpt(prepared.raw_brief_en)
        else null
      end as brief_en
    from prepared
    where prepared.raw_brief is not null
  ), title_ranked as (
    select
      excerpted.*,
      row_number() over (
        partition by title_key
        order by published_date desc, summary_updated_at desc, created_at desc, paper_id desc
      ) as title_rank
    from excerpted
    where href is not null
      and char_length(href) <= 2048
      and char_length(brief) between 60 and 500
      and brief ~ '[가-힣]'
  )
  select
    paper_id,
    published_date,
    title,
    title_ko,
    brief,
    brief_en,
    brief_kind,
    authors,
    author_count,
    journal,
    published_year,
    source,
    scope,
    href,
    data_as_of,
    statement_timestamp()
  from title_ranked
  where title_rank = 1;
end;
$$;

revoke all on function private.viore_knowledge_repair_brief(text) from public, anon, authenticated;
revoke all on function private.viore_knowledge_english_excerpt(text) from public, anon, authenticated;
revoke all on function private.refresh_viore_knowledge_public_papers() from public, anon, authenticated;
grant execute on function private.refresh_viore_knowledge_public_papers() to service_role;

select private.refresh_viore_knowledge_public_papers();
select private.refresh_viore_knowledge_public_snapshot();
