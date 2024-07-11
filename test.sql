with recursive region_hierarchy as (
select
	 id,
	 name,
	 parent_id,
	 alt_name,
	 location,
	 case
		 when deleted_at is null then true 
		else false 
	end as status,
	 1 as level
from
	region
where
	region.id is not null 
	and parent_id is null 
union ALL
select
	 e.id,
	 e.name,
	 e.parent_id,
	 e.alt_name,
	 e.location,
	 case
		 when e.deleted_at is null then true 
		else false 
	end as status,
	 eh.level + 1 
from
	region e
inner join region_hierarchy eh on
	e.parent_id = eh.id )
select
	count(*)
from
	region_hierarchy rh
left join region e on
	rh.parent_id = e.id
limit $1 offset $2;