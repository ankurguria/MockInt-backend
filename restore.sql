CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE "user_profiles" (
	"user_id" uuid NOT NULL DEFAULT uuid_generate_v4 (),
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL UNIQUE,
	"ph_no" bigint NOT NULL UNIQUE,
	"education" TEXT NOT NULL,
	"is_peer" BOOLEAN NOT NULL DEFAULT 'true',
	"created_at" timestamp with time zone NOT NULL,
	"country" varchar(255) NOT NULL,
	"time_zone" timestamp with time zone NOT NULL,
	"is_admin" BOOLEAN NOT NULL DEFAULT 'false',
	"is_expert" BOOLEAN NOT NULL DEFAULT 'false',
	"is_active" BOOLEAN NOT NULL DEFAULT 'false',
	"last_login" timestamp with time zone,
	"is_reported" bool NOT NULL DEFAULT 'false',
	"signup_type" varchar(255) NOT NULL,
	CONSTRAINT "user_profiles_pk" PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "expert" (
	"user_id" uuid NOT NULL UNIQUE,
	"current_org" varchar(255) NOT NULL,
	"expert_in_field" varchar(255) NOT NULL,
	"charges" int NOT NULL,
	"ratings" int,
	"is_verified" bool NOT NULL DEFAULT 'false',
	"expert_info" TEXT,
	CONSTRAINT "expert_pk" PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "scheduled_interviews" (
	"session_id" serial NOT NULL,
	"interviewer_id" uuid NOT NULL,
	"interviewee_id" uuid NOT NULL,
	"type_of_interview" varchar(255) NOT NULL,
	"slot_date" DATE NOT NULL,
	"slot_time" TIME NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"is_finished" bool NOT NULL DEFAULT 'false',
	"is_expert_interview" bool NOT NULL DEFAULT 'false',
	CONSTRAINT "scheduled_interviews_pk" PRIMARY KEY ("session_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "reported_users" (
	"flag_id" serial NOT NULL,
	"user_id" uuid NOT NULL,
	"flag_reason" TEXT NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"updated_by" uuid NOT NULL,
	CONSTRAINT "reported_users_pk" PRIMARY KEY ("flag_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "peer" (
	"user_id" uuid NOT NULL,
	"role_preparing_for" varchar(255) NOT NULL,
	CONSTRAINT "peer_pk" PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "domain" (
	"domain_id" serial NOT NULL,
	"domain_name" varchar(255) NOT NULL UNIQUE,
	CONSTRAINT "domain_pk" PRIMARY KEY ("domain_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_experienced_in_domain" (
	"experiences_id" serial NOT NULL,
	"user_id" uuid NOT NULL,
	"domain_id" int NOT NULL,
	"experience_duration" int NOT NULL,
	CONSTRAINT "user_experienced_in_domain_pk" PRIMARY KEY ("experiences_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "feedback" (
	"feedback_id" serial NOT NULL,
	"session_id" int NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"suggestions_for_us" TEXT,
	"feedback" TEXT NOT NULL,
	"overall_score" int NOT NULL,
	CONSTRAINT "feedback_pk" PRIMARY KEY ("feedback_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "interview_requests" (
	"schedule_id" serial NOT NULL,
	"user_id" uuid NOT NULL,
	"preffered_slot" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"is_expert_interview" bool NOT NULL DEFAULT 'false',
	"expert_id" uuid,
	CONSTRAINT "interview_requests_pk" PRIMARY KEY ("schedule_id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "expert" ADD CONSTRAINT "expert_fk0" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id");

ALTER TABLE "scheduled_interviews" ADD CONSTRAINT "scheduled_interviews_fk0" FOREIGN KEY ("interviewer_id") REFERENCES "user_profiles"("user_id");
ALTER TABLE "scheduled_interviews" ADD CONSTRAINT "scheduled_interviews_fk1" FOREIGN KEY ("interviewee_id") REFERENCES "user_profiles"("user_id");
ALTER TABLE "scheduled_interviews" ADD CONSTRAINT "scheduled_interviews_fk2" FOREIGN KEY ("created_by") REFERENCES "user_profiles"("user_id");
ALTER TABLE "scheduled_interviews" ADD CONSTRAINT "scheduled_interviews_fk3" FOREIGN KEY ("updated_by") REFERENCES "user_profiles"("user_id");

ALTER TABLE "reported_users" ADD CONSTRAINT "reported_users_fk0" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id");
ALTER TABLE "reported_users" ADD CONSTRAINT "reported_users_fk1" FOREIGN KEY ("created_by") REFERENCES "user_profiles"("user_id");
ALTER TABLE "reported_users" ADD CONSTRAINT "reported_users_fk2" FOREIGN KEY ("updated_by") REFERENCES "user_profiles"("user_id");

ALTER TABLE "peer" ADD CONSTRAINT "peer_fk0" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id");


ALTER TABLE "user_experienced_in_domain" ADD CONSTRAINT "user_experienced_in_domain_fk0" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id");
ALTER TABLE "user_experienced_in_domain" ADD CONSTRAINT "user_experienced_in_domain_fk1" FOREIGN KEY ("domain_id") REFERENCES "domain"("domain_id");

ALTER TABLE "feedback" ADD CONSTRAINT "feedback_fk0" FOREIGN KEY ("session_id") REFERENCES "scheduled_interviews"("session_id");
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_fk1" FOREIGN KEY ("created_by") REFERENCES "user_profiles"("user_id");
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_fk2" FOREIGN KEY ("updated_by") REFERENCES "user_profiles"("user_id");

ALTER TABLE "interview_requests" ADD CONSTRAINT "interview_requests_fk0" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id");
ALTER TABLE "interview_requests" ADD CONSTRAINT "interview_requests_fk1" FOREIGN KEY ("expert_id") REFERENCES "expert"("user_id");


insert into domain(domain_name) values('product');
insert into domain(domain_name) values('coding');
insert into domain(domain_name) values('operations');



