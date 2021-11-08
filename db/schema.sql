drop table if exists projects cascade;
drop table if exists project_member_relations cascade;

create table projects (
  id serial primary key,
  address char(42) not null,
  token char(42) not null,
  description varchar(120) not null,
  residual char(42) not null,
  target bigint not null,
  target_share bigint not null,
  creation_time timestamp not null,
  execution_deadline timestamp not null,
  completion_deadline timestamp not null,
  unique (address)
);

create index p_address on projects (address);

create table project_member_relations (
  id serial primary key,
  project_id int not null,
  member char(42) not null,
  signed boolean not null default false,
  constraint fk_project_id foreign key (project_id) references projects(id)
);

create index pmr_project_id on project_member_relations (project_id);
create index pmr_member on project_member_relations (member);
create index pmr_project_id_member on project_member_relations (project_id, member);
