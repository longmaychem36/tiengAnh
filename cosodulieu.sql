--
-- PostgreSQL database dump
--

\restrict IrQucG3dr8kyR5udjqo4BZcx4mEaPdHvgeRatHohFC15JaHtnPQqpIjQLYSjO5C

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.writingvocab DROP CONSTRAINT IF EXISTS writingvocab_exerciseid_fkey;
ALTER TABLE IF EXISTS ONLY public.writingprogress DROP CONSTRAINT IF EXISTS writingprogress_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.writingprogress DROP CONSTRAINT IF EXISTS writingprogress_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.writingexercises DROP CONSTRAINT IF EXISTS writingexercises_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.userstats DROP CONSTRAINT IF EXISTS userstats_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_levelid_fkey;
ALTER TABLE IF EXISTS ONLY public.usergameprogress DROP CONSTRAINT IF EXISTS usergameprogress_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.usergameprogress DROP CONSTRAINT IF EXISTS usergameprogress_levelid_fkey;
ALTER TABLE IF EXISTS ONLY public.usercollectionwords DROP CONSTRAINT IF EXISTS usercollectionwords_collectionid_fkey;
ALTER TABLE IF EXISTS ONLY public.usercollections DROP CONSTRAINT IF EXISTS usercollections_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.usercollections DROP CONSTRAINT IF EXISTS usercollections_reviewedby_fkey;
ALTER TABLE IF EXISTS ONLY public.supporttickets DROP CONSTRAINT IF EXISTS supporttickets_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.supporttickets DROP CONSTRAINT IF EXISTS supporttickets_respondedby_fkey;
ALTER TABLE IF EXISTS ONLY public.supportticketmessages DROP CONSTRAINT IF EXISTS supportticketmessages_ticketid_fkey;
ALTER TABLE IF EXISTS ONLY public.supportticketmessages DROP CONSTRAINT IF EXISTS supportticketmessages_senderid_fkey;
ALTER TABLE IF EXISTS ONLY public.studytimedaily DROP CONSTRAINT IF EXISTS studytimedaily_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.speakingquestions DROP CONSTRAINT IF EXISTS speakingquestions_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.speakingprogress DROP CONSTRAINT IF EXISTS speakingprogress_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.speakingprogress DROP CONSTRAINT IF EXISTS speakingprogress_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.spacedrepetitionreviews DROP CONSTRAINT IF EXISTS spacedrepetitionreviews_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.spacedrepetitionreviews DROP CONSTRAINT IF EXISTS spacedrepetitionreviews_itemid_fkey;
ALTER TABLE IF EXISTS ONLY public.spacedrepetitionitems DROP CONSTRAINT IF EXISTS spacedrepetitionitems_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.readingvocabulary DROP CONSTRAINT IF EXISTS readingvocabulary_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.readingquestions DROP CONSTRAINT IF EXISTS readingquestions_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.readingprogress DROP CONSTRAINT IF EXISTS readingprogress_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.readingprogress DROP CONSTRAINT IF EXISTS readingprogress_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.readingparagraphs DROP CONSTRAINT IF EXISTS readingparagraphs_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.paymentrequests DROP CONSTRAINT IF EXISTS paymentrequests_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.passwordresetcodes DROP CONSTRAINT IF EXISTS passwordresetcodes_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_createdby_fkey;
ALTER TABLE IF EXISTS ONLY public.notificationrecipients DROP CONSTRAINT IF EXISTS notificationrecipients_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.notificationrecipients DROP CONSTRAINT IF EXISTS notificationrecipients_notificationid_fkey;
ALTER TABLE IF EXISTS ONLY public.minigamequestions DROP CONSTRAINT IF EXISTS minigamequestions_levelid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningvocabulary DROP CONSTRAINT IF EXISTS listeningvocabulary_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningspeakers DROP CONSTRAINT IF EXISTS listeningspeakers_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningsegments DROP CONSTRAINT IF EXISTS listeningsegments_speakerid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningsegments DROP CONSTRAINT IF EXISTS listeningsegments_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningquestions DROP CONSTRAINT IF EXISTS listeningquestions_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningprogress DROP CONSTRAINT IF EXISTS listeningprogress_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningprogress DROP CONSTRAINT IF EXISTS listeningprogress_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.grammartopics DROP CONSTRAINT IF EXISTS grammartopics_categoryid_fkey;
ALTER TABLE IF EXISTS ONLY public.grammarquiz DROP CONSTRAINT IF EXISTS grammarquiz_topicid_fkey;
ALTER TABLE IF EXISTS ONLY public.grammarprogress DROP CONSTRAINT IF EXISTS grammarprogress_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.grammarprogress DROP CONSTRAINT IF EXISTS grammarprogress_topicid_fkey;
ALTER TABLE IF EXISTS ONLY public.dailytasks DROP CONSTRAINT IF EXISTS dailytasks_userid_fkey;
DROP INDEX IF EXISTS public.ux_usergameprogress_user_level;
DROP INDEX IF EXISTS public.uq_gamelevels_levelnumber;
DROP INDEX IF EXISTS public.uq_daily_tasks_user_date_order;
DROP INDEX IF EXISTS public.ix_minigamequestions_level_order;
DROP INDEX IF EXISTS public.idx_user_email;
DROP INDEX IF EXISTS public.idx_user_collections_public_review;
DROP INDEX IF EXISTS public.idx_support_tickets_user_created;
DROP INDEX IF EXISTS public.idx_support_tickets_status_created;
DROP INDEX IF EXISTS public.idx_support_ticket_messages_ticket_created;
DROP INDEX IF EXISTS public.idx_sr_reviews_item;
DROP INDEX IF EXISTS public.idx_sr_items_due;
DROP INDEX IF EXISTS public.idx_readingparagraphs_lesson;
DROP INDEX IF EXISTS public.idx_reading_vocab_lesson;
DROP INDEX IF EXISTS public.idx_reading_questions_lesson;
DROP INDEX IF EXISTS public.idx_reading_lessons_order;
DROP INDEX IF EXISTS public.idx_placement_minigame_active_type;
DROP INDEX IF EXISTS public.idx_payment_requests_transfer_content;
DROP INDEX IF EXISTS public.idx_payment_requests_sepay_transaction;
DROP INDEX IF EXISTS public.idx_password_reset_email_created;
DROP INDEX IF EXISTS public.idx_notification_recipients_user_created;
DROP INDEX IF EXISTS public.idx_notification_recipients_notification;
DROP INDEX IF EXISTS public.idx_listeningsegments_lesson;
DROP INDEX IF EXISTS public.idx_listening_vocab_lesson;
DROP INDEX IF EXISTS public.idx_listening_speakers_lesson;
DROP INDEX IF EXISTS public.idx_listening_segments_speaker;
DROP INDEX IF EXISTS public.idx_listening_questions_lesson;
DROP INDEX IF EXISTS public.idx_listening_lessons_order;
DROP INDEX IF EXISTS public.idx_daily_tasks_user_date;
ALTER TABLE IF EXISTS ONLY public.writingvocab DROP CONSTRAINT IF EXISTS writingvocab_pkey;
ALTER TABLE IF EXISTS ONLY public.writingprogress DROP CONSTRAINT IF EXISTS writingprogress_pkey;
ALTER TABLE IF EXISTS ONLY public.writinglessons DROP CONSTRAINT IF EXISTS writinglessons_pkey;
ALTER TABLE IF EXISTS ONLY public.writingexercises DROP CONSTRAINT IF EXISTS writingexercises_pkey;
ALTER TABLE IF EXISTS ONLY public.userstats DROP CONSTRAINT IF EXISTS userstats_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.usergameprogress DROP CONSTRAINT IF EXISTS usergameprogress_pkey;
ALTER TABLE IF EXISTS ONLY public.usercollectionwords DROP CONSTRAINT IF EXISTS usercollectionwords_pkey;
ALTER TABLE IF EXISTS ONLY public.usercollections DROP CONSTRAINT IF EXISTS usercollections_pkey;
ALTER TABLE IF EXISTS ONLY public.usergameprogress DROP CONSTRAINT IF EXISTS uq_ugp_user_level;
ALTER TABLE IF EXISTS ONLY public.supporttickets DROP CONSTRAINT IF EXISTS supporttickets_pkey;
ALTER TABLE IF EXISTS ONLY public.supportticketmessages DROP CONSTRAINT IF EXISTS supportticketmessages_pkey;
ALTER TABLE IF EXISTS ONLY public.studytimedaily DROP CONSTRAINT IF EXISTS studytimedaily_pkey;
ALTER TABLE IF EXISTS ONLY public.speakingquestions DROP CONSTRAINT IF EXISTS speakingquestions_pkey;
ALTER TABLE IF EXISTS ONLY public.speakingprogress DROP CONSTRAINT IF EXISTS speakingprogress_pkey;
ALTER TABLE IF EXISTS ONLY public.speakinglessons DROP CONSTRAINT IF EXISTS speakinglessons_pkey;
ALTER TABLE IF EXISTS ONLY public.spacedrepetitionreviews DROP CONSTRAINT IF EXISTS spacedrepetitionreviews_userid_attemptid_key;
ALTER TABLE IF EXISTS ONLY public.spacedrepetitionreviews DROP CONSTRAINT IF EXISTS spacedrepetitionreviews_pkey;
ALTER TABLE IF EXISTS ONLY public.spacedrepetitionitems DROP CONSTRAINT IF EXISTS spacedrepetitionitems_userid_targettype_targetid_key;
ALTER TABLE IF EXISTS ONLY public.spacedrepetitionitems DROP CONSTRAINT IF EXISTS spacedrepetitionitems_pkey;
ALTER TABLE IF EXISTS ONLY public.readingvocabulary DROP CONSTRAINT IF EXISTS readingvocabulary_pkey;
ALTER TABLE IF EXISTS ONLY public.readingquestions DROP CONSTRAINT IF EXISTS readingquestions_pkey;
ALTER TABLE IF EXISTS ONLY public.readingprogress DROP CONSTRAINT IF EXISTS readingprogress_pkey;
ALTER TABLE IF EXISTS ONLY public.readingparagraphs DROP CONSTRAINT IF EXISTS readingparagraphs_pkey;
ALTER TABLE IF EXISTS ONLY public.readinglessons DROP CONSTRAINT IF EXISTS readinglessons_pkey;
ALTER TABLE IF EXISTS ONLY public.placementminigamequestions DROP CONSTRAINT IF EXISTS placementminigamequestions_pkey;
ALTER TABLE IF EXISTS ONLY public.paymentrequests DROP CONSTRAINT IF EXISTS paymentrequests_pkey;
ALTER TABLE IF EXISTS ONLY public.passwordresetcodes DROP CONSTRAINT IF EXISTS passwordresetcodes_pkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_pkey;
ALTER TABLE IF EXISTS ONLY public.notificationrecipients DROP CONSTRAINT IF EXISTS notificationrecipients_pkey;
ALTER TABLE IF EXISTS ONLY public.notificationrecipients DROP CONSTRAINT IF EXISTS notificationrecipients_notificationid_userid_key;
ALTER TABLE IF EXISTS ONLY public.minigamequestions DROP CONSTRAINT IF EXISTS minigamequestions_pkey;
ALTER TABLE IF EXISTS ONLY public.listeningvocabulary DROP CONSTRAINT IF EXISTS listeningvocabulary_pkey;
ALTER TABLE IF EXISTS ONLY public.listeningspeakers DROP CONSTRAINT IF EXISTS listeningspeakers_pkey;
ALTER TABLE IF EXISTS ONLY public.listeningsegments DROP CONSTRAINT IF EXISTS listeningsegments_pkey;
ALTER TABLE IF EXISTS ONLY public.listeningquestions DROP CONSTRAINT IF EXISTS listeningquestions_pkey;
ALTER TABLE IF EXISTS ONLY public.listeningprogress DROP CONSTRAINT IF EXISTS listeningprogress_pkey;
ALTER TABLE IF EXISTS ONLY public.listeninglessons DROP CONSTRAINT IF EXISTS listeninglessons_pkey;
ALTER TABLE IF EXISTS ONLY public.learninglevels DROP CONSTRAINT IF EXISTS learninglevels_pkey;
ALTER TABLE IF EXISTS ONLY public.learninglevels DROP CONSTRAINT IF EXISTS learninglevels_code_key;
ALTER TABLE IF EXISTS ONLY public.grammartopics DROP CONSTRAINT IF EXISTS grammartopics_pkey;
ALTER TABLE IF EXISTS ONLY public.grammarquiz DROP CONSTRAINT IF EXISTS grammarquiz_pkey;
ALTER TABLE IF EXISTS ONLY public.grammarprogress DROP CONSTRAINT IF EXISTS grammarprogress_pkey;
ALTER TABLE IF EXISTS ONLY public.grammarcategories DROP CONSTRAINT IF EXISTS grammarcategories_pkey;
ALTER TABLE IF EXISTS ONLY public.gamelevels DROP CONSTRAINT IF EXISTS gamelevels_pkey;
ALTER TABLE IF EXISTS ONLY public.dailytasks DROP CONSTRAINT IF EXISTS dailytasks_pkey;
ALTER TABLE IF EXISTS public.learninglevels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.grammarcategories ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.writingvocab;
DROP TABLE IF EXISTS public.writingprogress;
DROP TABLE IF EXISTS public.writinglessons;
DROP TABLE IF EXISTS public.writingexercises;
DROP TABLE IF EXISTS public.userstats;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.usergameprogress;
DROP TABLE IF EXISTS public.usercollectionwords;
DROP TABLE IF EXISTS public.usercollections;
DROP TABLE IF EXISTS public.supporttickets;
DROP TABLE IF EXISTS public.supportticketmessages;
DROP TABLE IF EXISTS public.studytimedaily;
DROP TABLE IF EXISTS public.speakingquestions;
DROP TABLE IF EXISTS public.speakingprogress;
DROP TABLE IF EXISTS public.speakinglessons;
DROP TABLE IF EXISTS public.spacedrepetitionreviews;
DROP TABLE IF EXISTS public.spacedrepetitionitems;
DROP TABLE IF EXISTS public.readingvocabulary;
DROP TABLE IF EXISTS public.readingquestions;
DROP TABLE IF EXISTS public.readingprogress;
DROP TABLE IF EXISTS public.readingparagraphs;
DROP TABLE IF EXISTS public.readinglessons;
DROP TABLE IF EXISTS public.placementminigamequestions;
DROP TABLE IF EXISTS public.paymentrequests;
DROP TABLE IF EXISTS public.passwordresetcodes;
DROP TABLE IF EXISTS public.notifications;
DROP TABLE IF EXISTS public.notificationrecipients;
DROP TABLE IF EXISTS public.minigamequestions;
DROP TABLE IF EXISTS public.listeningvocabulary;
DROP TABLE IF EXISTS public.listeningspeakers;
DROP TABLE IF EXISTS public.listeningsegments;
DROP TABLE IF EXISTS public.listeningquestions;
DROP TABLE IF EXISTS public.listeningprogress;
DROP TABLE IF EXISTS public.listeninglessons;
DROP SEQUENCE IF EXISTS public.learninglevels_id_seq;
DROP TABLE IF EXISTS public.learninglevels;
DROP TABLE IF EXISTS public.grammartopics;
DROP TABLE IF EXISTS public.grammarquiz;
DROP TABLE IF EXISTS public.grammarprogress;
DROP SEQUENCE IF EXISTS public.grammarcategories_id_seq;
DROP TABLE IF EXISTS public.grammarcategories;
DROP TABLE IF EXISTS public.gamelevels;
DROP TABLE IF EXISTS public.dailytasks;
DROP EXTENSION IF EXISTS pgcrypto;
DROP SCHEMA IF EXISTS schema;
--
-- Name: schema; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA schema;


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: dailytasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dailytasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid NOT NULL,
    taskdate date NOT NULL,
    skill character varying(40) NOT NULL,
    targettype character varying(80) NOT NULL,
    targetid character varying(120) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    reason text,
    status character varying(30) DEFAULT 'pending'::character varying NOT NULL,
    orderindex integer DEFAULT 0 NOT NULL,
    airationale text,
    completedat timestamp without time zone,
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    rewardexp integer DEFAULT 10 NOT NULL,
    planversion smallint DEFAULT 1 NOT NULL,
    taskmode character varying(20) DEFAULT 'new'::character varying NOT NULL,
    duedate date
);


--
-- Name: gamelevels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gamelevels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    levelnumber integer NOT NULL,
    name character varying(200),
    difficulty character varying(20) DEFAULT 'easy'::character varying,
    timelimit integer DEFAULT 60,
    passscore integer DEFAULT 70,
    islocked boolean DEFAULT false,
    createdat timestamp without time zone DEFAULT now(),
    CONSTRAINT ck_gamelevels_difficulty CHECK (((difficulty)::text = ANY ((ARRAY['easy'::character varying, 'medium'::character varying, 'hard'::character varying])::text[]))),
    CONSTRAINT ck_gamelevels_passscore CHECK (((passscore >= 0) AND (passscore <= 100))),
    CONSTRAINT ck_gamelevels_timelimit CHECK ((timelimit > 0))
);


--
-- Name: grammarcategories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grammarcategories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    namevi character varying(100),
    icon character varying(10) DEFAULT '📘'::character varying,
    orderindex integer DEFAULT 0
);


--
-- Name: grammarcategories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.grammarcategories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grammarcategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.grammarcategories_id_seq OWNED BY public.grammarcategories.id;


--
-- Name: grammarprogress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grammarprogress (
    userid uuid NOT NULL,
    topicid uuid NOT NULL,
    bestscore integer DEFAULT 0,
    lastscore integer DEFAULT 0,
    attempts integer DEFAULT 0,
    status character varying(20) DEFAULT 'in_progress'::character varying,
    updatedat timestamp without time zone DEFAULT now()
);


--
-- Name: grammarquiz; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grammarquiz (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    topicid uuid,
    question text NOT NULL,
    optiona character varying(255),
    optionb character varying(255),
    optionc character varying(255),
    optiond character varying(255),
    correctanswer character varying(1),
    explanation text
);


--
-- Name: grammartopics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grammartopics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    categoryid integer,
    title character varying(200) NOT NULL,
    titlevi character varying(200),
    content text,
    orderindex integer DEFAULT 0
);


--
-- Name: learninglevels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learninglevels (
    id integer NOT NULL,
    code character varying(20),
    name character varying(100),
    description character varying(255)
);


--
-- Name: learninglevels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.learninglevels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: learninglevels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.learninglevels_id_seq OWNED BY public.learninglevels.id;


--
-- Name: listeninglessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listeninglessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    level character varying(20) DEFAULT 'A1'::character varying,
    topic character varying(120),
    objective text,
    duration character varying(50),
    passagetitle character varying(255),
    audiourl text,
    orderindex integer DEFAULT 0,
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now(),
    isfoundation boolean DEFAULT false
);


--
-- Name: listeningprogress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listeningprogress (
    userid uuid NOT NULL,
    lessonid uuid NOT NULL,
    status character varying(50) DEFAULT 'in_progress'::character varying,
    score double precision,
    updatedat timestamp with time zone DEFAULT now()
);


--
-- Name: listeningquestions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listeningquestions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid NOT NULL,
    questiontype character varying(50) DEFAULT 'multiple_choice'::character varying,
    prompt text NOT NULL,
    optiona text,
    optionb text,
    optionc text,
    optiond text,
    correctanswer text,
    correctboolean boolean,
    acceptedanswers text,
    explanation text,
    orderindex integer DEFAULT 0
);


--
-- Name: listeningsegments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listeningsegments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid NOT NULL,
    speaker character varying(120),
    text text NOT NULL,
    orderindex integer DEFAULT 0,
    speakerid uuid
);


--
-- Name: listeningspeakers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listeningspeakers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid NOT NULL,
    name character varying(120) NOT NULL,
    gender character varying(20) DEFAULT 'female'::character varying,
    voicename character varying(180),
    voiceuri character varying(255),
    orderindex integer DEFAULT 0,
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now()
);


--
-- Name: listeningvocabulary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listeningvocabulary (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid NOT NULL,
    word character varying(120) NOT NULL,
    meaning character varying(255),
    orderindex integer DEFAULT 0
);


--
-- Name: minigamequestions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.minigamequestions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    levelid uuid NOT NULL,
    questiontype character varying(50) NOT NULL,
    contenten character varying(500),
    contentvi character varying(500),
    audiourl character varying(500),
    imageurl character varying(500),
    correctanswer character varying(500),
    options text,
    orderindex integer DEFAULT 0
);


--
-- Name: notificationrecipients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notificationrecipients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    notificationid uuid NOT NULL,
    userid uuid NOT NULL,
    readat timestamp without time zone,
    emailedat timestamp without time zone,
    emailerror text,
    createdat timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(180) NOT NULL,
    message text NOT NULL,
    type character varying(40) DEFAULT 'info'::character varying NOT NULL,
    linkurl text,
    audience character varying(30) DEFAULT 'selected'::character varying NOT NULL,
    createdby uuid,
    createdat timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: passwordresetcodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.passwordresetcodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid NOT NULL,
    email character varying(255) NOT NULL,
    codehash text NOT NULL,
    expiresat timestamp without time zone NOT NULL,
    usedat timestamp without time zone,
    createdat timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: paymentrequests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.paymentrequests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid NOT NULL,
    plan character varying(20) DEFAULT 'plus'::character varying NOT NULL,
    amount integer NOT NULL,
    status character varying(20) DEFAULT 'completed'::character varying NOT NULL,
    transfercontent character varying(120) NOT NULL,
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    completedat timestamp without time zone,
    gateway character varying(40) DEFAULT 'sepay'::character varying NOT NULL,
    sepaytransactionid character varying(80),
    rawpayload jsonb
);


--
-- Name: placementminigamequestions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placementminigamequestions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    questiontype character varying(50) NOT NULL,
    contenten text DEFAULT ''::text,
    contentvi text DEFAULT ''::text,
    audiourl text,
    imageurl text,
    correctanswer text DEFAULT ''::text,
    options jsonb,
    difficulty character varying(20) DEFAULT 'easy'::character varying,
    pointratio numeric(6,2) DEFAULT 1,
    isactive boolean DEFAULT true,
    orderindex integer DEFAULT 0,
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now()
);


--
-- Name: readinglessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.readinglessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    level character varying(20) DEFAULT 'A1'::character varying,
    topic character varying(120),
    objective text,
    duration character varying(50),
    passagetitle character varying(255),
    audiourl text,
    orderindex integer DEFAULT 0,
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now(),
    isfoundation boolean DEFAULT false
);


--
-- Name: readingparagraphs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.readingparagraphs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid NOT NULL,
    content text NOT NULL,
    orderindex integer DEFAULT 0
);


--
-- Name: readingprogress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.readingprogress (
    userid uuid NOT NULL,
    lessonid uuid NOT NULL,
    status character varying(50) DEFAULT 'in_progress'::character varying,
    score double precision,
    updatedat timestamp with time zone DEFAULT now()
);


--
-- Name: readingquestions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.readingquestions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid NOT NULL,
    questiontype character varying(50) DEFAULT 'multiple_choice'::character varying,
    prompt text NOT NULL,
    optiona text,
    optionb text,
    optionc text,
    optiond text,
    correctanswer text,
    correctboolean boolean,
    acceptedanswers text,
    explanation text,
    orderindex integer DEFAULT 0
);


--
-- Name: readingvocabulary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.readingvocabulary (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid NOT NULL,
    word character varying(120) NOT NULL,
    meaning character varying(255),
    orderindex integer DEFAULT 0
);


--
-- Name: spacedrepetitionitems; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.spacedrepetitionitems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid NOT NULL,
    targettype character varying(80) NOT NULL,
    targetid character varying(120) NOT NULL,
    easefactor numeric(4,2) DEFAULT 2.50 NOT NULL,
    intervaldays integer DEFAULT 0 NOT NULL,
    repetitions integer DEFAULT 0 NOT NULL,
    lapses integer DEFAULT 0 NOT NULL,
    lastscore integer,
    lastquality smallint,
    lastreviewedat timestamp with time zone,
    duedate date DEFAULT ((now() AT TIME ZONE 'Asia/Ho_Chi_Minh'::text))::date NOT NULL,
    lastassignedat timestamp with time zone,
    createdat timestamp with time zone DEFAULT now() NOT NULL,
    updatedat timestamp with time zone DEFAULT now() NOT NULL,
    ismastered boolean DEFAULT false NOT NULL,
    masteredat timestamp with time zone
);


--
-- Name: spacedrepetitionreviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.spacedrepetitionreviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    itemid uuid NOT NULL,
    userid uuid NOT NULL,
    attemptid uuid NOT NULL,
    score integer NOT NULL,
    quality smallint NOT NULL,
    previouseasefactor numeric(4,2) NOT NULL,
    nexteasefactor numeric(4,2) NOT NULL,
    previousintervaldays integer NOT NULL,
    nextintervaldays integer NOT NULL,
    previousrepetitions integer NOT NULL,
    nextrepetitions integer NOT NULL,
    reviewedat timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: speakinglessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.speakinglessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255),
    description text,
    orderindex integer DEFAULT 0,
    createdat timestamp without time zone DEFAULT now(),
    isfoundation boolean DEFAULT false
);


--
-- Name: speakingprogress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.speakingprogress (
    userid uuid NOT NULL,
    lessonid uuid NOT NULL,
    status character varying(50) DEFAULT 'in_progress'::character varying,
    score double precision DEFAULT 0,
    updatedat timestamp without time zone DEFAULT now()
);


--
-- Name: speakingquestions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.speakingquestions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid,
    question character varying(500),
    translation character varying(500),
    option1 character varying(500),
    option1vi character varying(500),
    option2 character varying(500),
    option2vi character varying(500),
    option3 character varying(500),
    option3vi character varying(500),
    orderindex integer DEFAULT 0
);


--
-- Name: studytimedaily; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.studytimedaily (
    userid uuid NOT NULL,
    activitydate date DEFAULT CURRENT_DATE NOT NULL,
    activeseconds integer DEFAULT 0 NOT NULL,
    updatedat timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: supportticketmessages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supportticketmessages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ticketid uuid NOT NULL,
    senderid uuid NOT NULL,
    senderrole character varying(20) NOT NULL,
    message text NOT NULL,
    attachmenturl text,
    attachmentpublicid character varying(255),
    attachmentoriginalname character varying(255),
    attachmentmimetype character varying(120),
    createdat timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: supporttickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supporttickets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid NOT NULL,
    email character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    category character varying(80) NOT NULL,
    status character varying(30) DEFAULT 'open'::character varying NOT NULL,
    attachmenturl text,
    attachmentpublicid character varying(255),
    attachmentoriginalname character varying(255),
    attachmentmimetype character varying(120),
    adminresponse text,
    respondedby uuid,
    respondedat timestamp without time zone,
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    updatedat timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: usercollections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usercollections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    createdat timestamp without time zone DEFAULT now(),
    ispublic boolean DEFAULT false NOT NULL,
    reviewstatus character varying(20) DEFAULT 'approved'::character varying NOT NULL,
    submittedat timestamp with time zone,
    reviewedat timestamp with time zone,
    reviewedby uuid,
    updatedat timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: usercollectionwords; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usercollectionwords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    collectionid uuid NOT NULL,
    customword character varying(255),
    custommeaning text,
    customexample text,
    addedat timestamp without time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: usergameprogress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usergameprogress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid NOT NULL,
    levelid uuid NOT NULL,
    score integer DEFAULT 0,
    stars integer DEFAULT 0,
    iscompleted boolean DEFAULT false,
    besttime integer DEFAULT 0,
    attempts integer DEFAULT 0,
    completedat timestamp without time zone
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    passwordhash character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    levelid integer,
    isactive boolean DEFAULT true,
    createdat timestamp without time zone DEFAULT now(),
    plan character varying(20) DEFAULT 'free'::character varying,
    plusexpiresat timestamp without time zone,
    avatarurl text,
    onboardingcompleted boolean DEFAULT true,
    placementlevel character varying(20),
    placementsource character varying(30),
    placementcompletedat timestamp with time zone,
    CONSTRAINT users_placementlevel_check CHECK (((placementlevel IS NULL) OR ((placementlevel)::text = ANY ((ARRAY['new'::character varying, 'basic'::character varying])::text[])))),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[])))
);


--
-- Name: userstats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.userstats (
    userid uuid NOT NULL,
    exp integer DEFAULT 0,
    level integer DEFAULT 1,
    streakdays integer DEFAULT 0,
    lastlogin timestamp without time zone
);


--
-- Name: writingexercises; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.writingexercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid,
    contentvi text,
    correctansweren text,
    orderindex integer
);


--
-- Name: writinglessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.writinglessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255),
    description text,
    orderindex integer,
    createdat timestamp without time zone DEFAULT now(),
    passageen text,
    passagevi text,
    isfoundation boolean DEFAULT false
);


--
-- Name: writingprogress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.writingprogress (
    userid uuid NOT NULL,
    lessonid uuid NOT NULL,
    status character varying(50),
    score double precision,
    updatedat timestamp without time zone DEFAULT now()
);


--
-- Name: writingvocab; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.writingvocab (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    exerciseid uuid,
    word character varying(100),
    meaning character varying(255)
);


--
-- Name: grammarcategories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grammarcategories ALTER COLUMN id SET DEFAULT nextval('public.grammarcategories_id_seq'::regclass);


--
-- Name: learninglevels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learninglevels ALTER COLUMN id SET DEFAULT nextval('public.learninglevels_id_seq'::regclass);


--
-- Data for Name: dailytasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dailytasks (id, userid, taskdate, skill, targettype, targetid, title, description, reason, status, orderindex, airationale, completedat, createdat, rewardexp, planversion, taskmode, duedate) FROM stdin;
\.


--
-- Data for Name: gamelevels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gamelevels (id, levelnumber, name, difficulty, timelimit, passscore, islocked, createdat) FROM stdin;
146f267b-a919-48cb-bcb8-bd2b72042a41	6	Daily Life Challenge - Weekend Plans	hard	120	80	f	2026-05-15 09:16:20.152769
2ef484dc-eba4-4c72-bb6d-93e22387ea22	7	Travel English Quest - At the Airport	easy	120	60	f	2026-05-15 09:16:20.17004
b3a06059-9c12-4ddd-836a-dce3ee532980	8	Travel English Quest - Hotel Check-in	medium	120	70	f	2026-05-15 09:16:20.186419
961a2291-c16b-494d-b250-229f06c1988d	9	Travel English Quest - Asking for Directions	hard	120	80	f	2026-05-15 09:16:20.200311
d495c777-2742-46e0-94e6-fcad0cdf8666	10	Work & Study Arena - Classroom English	easy	120	60	f	2026-05-15 09:16:20.217083
bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	11	Work & Study Arena - Office Talk	medium	120	70	f	2026-05-15 09:16:20.240031
f72f920f-6bb2-4bf6-a275-eda18bd8f269	12	Work & Study Arena - Professional Email	hard	120	80	f	2026-05-15 09:16:20.253471
272f6249-9f90-4839-b660-f7fbc4e98927	1	Khởi động	easy	120	60	f	2026-05-12 07:58:43.102497
013fdce3-0f74-4768-a98a-f512e26b0574	2	Nâng cao	medium	120	70	f	2026-05-12 07:58:43.129076
c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	3	Thách thức	hard	120	80	f	2026-05-12 07:58:43.144217
c13eed73-58fc-4b72-8d11-0afc9232a2f9	4	Daily Life Challenge - Morning Routine	easy	120	60	f	2026-05-15 09:16:20.041573
0f74d8a0-b845-4939-95fa-15cbe624b29f	5	Daily Life Challenge - At Home	medium	120	70	f	2026-05-15 09:16:20.137146
\.


--
-- Data for Name: grammarcategories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grammarcategories (id, name, namevi, icon, orderindex) FROM stdin;
42	Modal Verbs	Động từ khuyết thiếu	🔧	4
43	Comparatives & Superlatives	So sánh hơn & So sánh nhất	⚖️	5
45	Articles	Mạo từ	📎	7
46	Prepositions	Giới từ	📍	8
47	Gerunds & Infinitives	Danh động từ & Nguyên mẫu	🔤	9
48	Question Tags	Câu hỏi đuôi	❓	10
49	Subject-Verb Agreement	Sự hòa hợp chủ-vị	🤝	11
39	Conditionals	Câu điều kiện	🔀	1
44	Relative Clauses	Mệnh đề quan hệ	🔗	6
38	Tenses	Các thì trong tiếng Anh	⏰	0
40	Passive Voice	Câu bị động	🔄	2
41	Reported Speech	Câu tường thuật	💬	3
\.


--
-- Data for Name: grammarprogress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grammarprogress (userid, topicid, bestscore, lastscore, attempts, status, updatedat) FROM stdin;
00000000-0000-4000-8000-000000000101	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	76	76	1	completed	2026-07-01 19:00:00
00000000-0000-4000-8000-000000000102	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	92	92	2	completed	2026-07-01 19:05:00
00000000-0000-4000-8000-000000000102	e088946a-b0cf-494c-9746-85e1420a95c1	68	68	1	in_progress	2026-07-01 19:10:00
00000000-0000-4000-8000-000000000103	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	100	100	1	completed	2026-07-01 19:15:00
00000000-0000-4000-8000-000000000103	e088946a-b0cf-494c-9746-85e1420a95c1	94	94	2	completed	2026-07-01 19:20:00
00000000-0000-4000-8000-000000000103	90ad11e3-ee89-49c2-a421-0ef502b8744a	72	72	1	in_progress	2026-07-01 19:25:00
\.


--
-- Data for Name: grammarquiz; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grammarquiz (id, topicid, question, optiona, optionb, optionc, optiond, correctanswer, explanation) FROM stdin;
c185035f-3fdf-4956-b083-dd84fd459b9b	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	The meeting starts ___ 9 a.m.	in	on	at	by	C	At dùng với giờ cụ thể.
82a83ec6-075a-459f-a74c-a5091aa94d08	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	My birthday is ___ June.	in	on	at	to	A	In dùng với tháng.
03b67e4f-a378-4adf-ac51-81c5a445ee5e	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	We have class ___ Monday.	in	on	at	by	B	On dùng với ngày trong tuần.
f1467750-0f41-46d4-9b49-13398195f0a5	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	She lives ___ the third floor.	in	on	at	to	B	On dùng cho tầng.
5aa34786-48c0-4628-9e81-b9ec8029a18c	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	The children are ___ the park.	in	on	at	by	A	In dùng trong khu vực/không gian.
72e0bad3-5ed6-4395-bc44-3be265676504	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	I usually study ___ night.	in	on	at	by	C	Cụm cố định: at night.
be07bd8f-bcd4-4d8c-9f68-45360bcf2974	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	The keys are ___ the table.	in	on	at	to	B	On dùng khi vật nằm trên bề mặt.
2959d66c-4aac-4387-9ce6-6ffd257a84f1	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	We arrived ___ the airport early.	in	on	at	to	C	At dùng cho địa điểm cụ thể như airport.
7d9bb781-4b85-437e-8c37-b7e7bec8211e	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	She was born ___ 2001.	in	on	at	by	A	In dùng với năm.
92c88317-3365-4a6f-bf02-e33d70917dd7	e088946a-b0cf-494c-9746-85e1420a95c1	If you heat ice, it ___.	melts	will melt	melted	is melting	A	Sự thật chung dùng điều kiện loại 0.
a3cf3527-2a78-42b7-aca5-ccf163f81238	e088946a-b0cf-494c-9746-85e1420a95c1	If it rains tomorrow, we ___ at home.	stay	stayed	will stay	stays	C	Điều kiện loại 1: if + hiện tại đơn, will + V.
90d11be1-1384-4cdf-9a52-bb9fe210179d	e088946a-b0cf-494c-9746-85e1420a95c1	If water reaches 100°C, it ___.	boil	boils	will boil	boiled	B	Quy luật tự nhiên dùng loại 0.
6147564d-7373-4fd8-bd2c-0ee2e05330cb	e088946a-b0cf-494c-9746-85e1420a95c1	If she ___ hard, she will pass.	studies	will study	studied	study	A	Mệnh đề if loại 1 dùng hiện tại đơn.
d45a0f0f-e29d-4f8b-b552-9e3ca5648fca	e088946a-b0cf-494c-9746-85e1420a95c1	You get tired if you ___ enough.	don't sleep	won't sleep	didn't sleep	aren't sleep	A	Loại 0 diễn tả kết quả thường đúng.
b4477cd3-96c9-4fc1-a158-c6af107998a2	e088946a-b0cf-494c-9746-85e1420a95c1	If I see Tom, I ___ him your message.	give	gave	will give	gives	C	Kết quả tương lai dùng will.
1c2c1c94-9691-4e5c-874e-d07a7f809b26	e088946a-b0cf-494c-9746-85e1420a95c1	Plants die if they ___ water.	don't get	won't get	didn't get	aren't get	A	Sự thật chung dùng hiện tại đơn ở cả hai mệnh đề.
87cf1c71-ae25-4032-b917-dc198df53ecb	e088946a-b0cf-494c-9746-85e1420a95c1	If you are free tonight, ___ you call me?	do	did	will	are	C	Câu hỏi kết quả trong loại 1 dùng will.
4ec19ad5-c3cf-4c32-8e0d-0aae4cc96c0d	e088946a-b0cf-494c-9746-85e1420a95c1	If he misses the bus, he ___ late.	is	was	will be	be	C	Khả năng thật ở tương lai dùng first conditional.
e7141208-044b-42ea-9215-c764eb8b94dc	e088946a-b0cf-494c-9746-85e1420a95c1	If people eat too much sugar, they often ___ weight.	gain	will gain	gained	gains	A	Thói quen/kết quả chung dùng loại 0.
0e14e1e6-748d-4cef-9ad9-49815eb05b56	90ad11e3-ee89-49c2-a421-0ef502b8744a	We ___ to Da Nang last summer.	go	goes	went	gone	C	Last summer là thời điểm quá khứ đã kết thúc.
2b873b9a-c4e5-45fa-827f-490b935de8a3	90ad11e3-ee89-49c2-a421-0ef502b8744a	She ___ breakfast this morning.	doesn't eat	didn't eat	isn't eating	hasn't eat	B	Phủ định quá khứ dùng didn't + V nguyên thể.
b80ba8fa-a7dd-4f53-9d18-aa1b69faf3e2	90ad11e3-ee89-49c2-a421-0ef502b8744a	___ you watch the game yesterday?	Do	Did	Are	Have	B	Yesterday dùng quá khứ đơn; câu hỏi dùng did.
348246a4-036b-42dd-a803-6d1c25c8a7a4	90ad11e3-ee89-49c2-a421-0ef502b8744a	They ___ at home last night.	was	were	are	be	B	They đi với were trong quá khứ.
4e64676a-acc5-47dd-98c6-0685a6e527d1	90ad11e3-ee89-49c2-a421-0ef502b8744a	He ___ the window two minutes ago.	opens	opened	is opening	has opened	B	Ago là dấu hiệu quá khứ đơn.
cebb4781-e8eb-4ba8-9899-aad461944661	90ad11e3-ee89-49c2-a421-0ef502b8744a	I ___ my keys yesterday.	lose	lost	loses	am losing	B	Lose là động từ bất quy tắc: lost.
8d2c9dcc-4345-442d-a193-be1b22c45bdb	90ad11e3-ee89-49c2-a421-0ef502b8744a	Did she ___ the email?	sent	sends	send	sending	C	Sau did, động từ chính về nguyên thể.
07f5ab82-a4bd-4ad9-8c81-e6ace47367c4	90ad11e3-ee89-49c2-a421-0ef502b8744a	The meeting ___ at 10 a.m.	begin	began	begun	begins	B	Begin ở quá khứ đơn là began.
e63691c2-93ff-43be-b461-4472be8d2c7d	90ad11e3-ee89-49c2-a421-0ef502b8744a	We ___ tired after the trip.	was	were	are	be	B	We dùng were.
91b81ff4-caac-4423-8db3-26de83592946	90ad11e3-ee89-49c2-a421-0ef502b8744a	My father ___ a new bike when he was young.	buys	bought	buy	buying	B	When he was young là bối cảnh quá khứ.
e9e453e7-3365-43c0-8adc-a747793f3a94	898cd0be-8da5-413e-b201-5d622ac826de	If I had known, I ___ you.	would call	will call	would have called	called	C	Điều kiện loại 3 dùng would have + V3.
2b537fea-c95e-4bf9-8da4-d0319d0ad88d	898cd0be-8da5-413e-b201-5d622ac826de	She would have passed if she ___ more.	studied	had studied	studies	would study	B	Mệnh đề if loại 3 dùng had + V3.
b521cf76-571e-421f-9dab-8e2f8856ebad	898cd0be-8da5-413e-b201-5d622ac826de	If they had left earlier, they ___ the train.	catch	caught	would catch	would have caught	D	Kết quả giả định trong quá khứ dùng would have caught.
7215253e-99d4-4d87-83d9-8e52c7466c4a	898cd0be-8da5-413e-b201-5d622ac826de	We ___ late if the taxi had arrived on time.	weren't	wouldn't be	wouldn't have been	aren't	C	Kết quả ngược quá khứ dùng wouldn't have been.
643287ea-5e17-43ec-a853-47f83696aa96	898cd0be-8da5-413e-b201-5d622ac826de	If he ___ the map, he wouldn't have got lost.	checked	had checked	checks	would check	B	Điều kiện không xảy ra trong quá khứ dùng had checked.
7dfd10b8-2ebf-4315-99f8-c0b8a6b7778a	898cd0be-8da5-413e-b201-5d622ac826de	I would have helped you if you ___ me.	ask	asked	had asked	would ask	C	If + past perfect.
d5121889-6dbd-41e6-9237-1b3f2d1d8e83	898cd0be-8da5-413e-b201-5d622ac826de	If it hadn't rained, we ___ outside.	played	will play	would play	would have played	D	Kết quả giả định quá khứ dùng would have played.
637e9929-1e01-456b-80ac-81300407bac2	898cd0be-8da5-413e-b201-5d622ac826de	She ___ the job if she had prepared better.	gets	got	would get	would have got	D	Would have + V3 cho kết quả quá khứ.
0e42bd47-6b5a-406b-9ab9-b39e02d20aad	898cd0be-8da5-413e-b201-5d622ac826de	If I had seen the email, I ___ earlier.	reply	replied	would have replied	will reply	C	Email không được thấy trong quá khứ, kết quả giả định dùng would have replied.
d634efd2-daf4-45f1-904b-923667a56619	898cd0be-8da5-413e-b201-5d622ac826de	They would not have missed the flight if they ___ on time.	arrive	arrived	had arrived	would arrive	C	Mệnh đề if loại 3 dùng had arrived.
3e8c94e6-8e38-4725-a5fa-78703056c3e4	f49c9967-880b-49d0-b9ca-7ebe37dd0971	I saw ___ elephant at the zoo.	a	an	the	no article	B	Elephant bắt đầu bằng âm nguyên âm nên dùng an.
c047ee9a-80eb-41e1-bcf4-9c810897dbd3	f49c9967-880b-49d0-b9ca-7ebe37dd0971	She bought ___ new phone yesterday.	a	an	the	no article	A	Nhắc lần đầu một chiếc điện thoại chưa xác định dùng a.
b188f5b6-93ab-4a4c-be58-a0eb6851c020	f49c9967-880b-49d0-b9ca-7ebe37dd0971	___ sun rises in the east.	A	An	The	No article	C	Sun là đối tượng duy nhất trong ngữ cảnh.
fbe744b4-a1d4-493c-ab0f-94373b44dcbf	f49c9967-880b-49d0-b9ca-7ebe37dd0971	I like ___ music.	a	an	the	no article	D	Nói chung về music không dùng mạo từ.
0b170291-6582-4fb8-9256-bff4709c532f	f49c9967-880b-49d0-b9ca-7ebe37dd0971	He is ___ honest man.	a	an	the	no article	B	Honest bắt đầu bằng âm /o/ nên dùng an.
f526548c-9da6-4ad3-b46a-3aa001059d63	f49c9967-880b-49d0-b9ca-7ebe37dd0971	Can you close ___ door?	a	an	the	no article	C	Door đã xác định trong ngữ cảnh.
32319bc6-1c3d-4e55-939e-d67edf24d17b	f49c9967-880b-49d0-b9ca-7ebe37dd0971	She wants to be ___ engineer.	a	an	the	no article	B	Engineer bắt đầu bằng âm nguyên âm nên dùng an.
79f3e2e5-6a0b-4a58-8af2-4e419ee7b421	f49c9967-880b-49d0-b9ca-7ebe37dd0971	___ apples are good for your health.	A	An	The	No article	D	Nói chung về danh từ số nhiều dùng no article.
65e3b813-ec5d-498a-99d2-1f56d162f914	f49c9967-880b-49d0-b9ca-7ebe37dd0971	This is ___ best day of my life.	a	an	the	no article	C	So sánh nhất dùng the.
33a5c3a7-7d67-4fa0-9ccc-4a88b6af376d	f49c9967-880b-49d0-b9ca-7ebe37dd0971	We stayed at ___ hotel near the airport.	a	an	the	no article	A	Hotel được nhắc lần đầu, dùng a.
e5ba2188-a380-4b16-831e-74a238e676d0	1390d58f-d902-4d8a-a6cc-e455e66c25e7	Listen! Someone ___ at the door.	knocks	is knocking	knock	knocked	B	Listen! báo hiệu hành động đang xảy ra.
730b93de-777a-4249-bf05-6b667e790d32	1390d58f-d902-4d8a-a6cc-e455e66c25e7	We ___ dinner right now.	have	are having	has	had	B	Right now dùng hiện tại tiếp diễn.
9440baf5-3f3b-436a-9841-2aeffb4cad37	1390d58f-d902-4d8a-a6cc-e455e66c25e7	She ___ with her aunt this week.	stays	is staying	stay	stayed	B	This week ở đây diễn tả tình huống tạm thời.
e3c35365-65ed-4250-8771-b92f7d0ea9ec	1390d58f-d902-4d8a-a6cc-e455e66c25e7	I ___ the answer.	am knowing	know	knowing	am know	B	Know là stative verb nên thường dùng hiện tại đơn.
1afe9ec8-fc35-4f39-85d1-5c8bfda50243	1390d58f-d902-4d8a-a6cc-e455e66c25e7	They ___ a new bridge in the city.	build	are building	builds	built	B	Hành động đang diễn ra trong giai đoạn hiện tại dùng are building.
bed23913-86f5-4d16-95f8-a091f1f26e5d	1390d58f-d902-4d8a-a6cc-e455e66c25e7	Look! The dog ___ across the street.	runs	is running	run	ran	B	Look! dùng với hành động đang xảy ra.
6c7d5d82-dd87-4624-8706-272926d1cc3a	1390d58f-d902-4d8a-a6cc-e455e66c25e7	What ___ you ___ tonight?	do / do	are / doing	did / do	does / do	B	Kế hoạch gần có thể dùng hiện tại tiếp diễn.
cc691943-18dd-49b3-a111-04eeb843b526	1390d58f-d902-4d8a-a6cc-e455e66c25e7	Online prices ___ quickly.	change	are changing	changes	changed	B	Xu hướng đang thay đổi dùng hiện tại tiếp diễn.
cf70923c-aee4-4e6f-a843-a39da1dafcdb	1390d58f-d902-4d8a-a6cc-e455e66c25e7	He ___ a blue shirt today.	wears	is wearing	wear	wore	B	Today diễn tả trạng thái tạm thời trong hiện tại.
ea4d36e7-e9b2-4b34-81db-0ac7456def95	1390d58f-d902-4d8a-a6cc-e455e66c25e7	Be quiet! The students ___ a test.	take	are taking	takes	took	B	Be quiet! cho thấy hành động đang diễn ra.
18d8b75f-5201-48b6-9ffc-3b3b8ceb2648	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	My brother ___ football on Sundays.	play	plays	is playing	played	B	My brother là ngôi 3 số ít nên động từ thêm -s.
a790bd6e-e3e1-40f5-988e-162b0f9fa8d7	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	I ___ coffee after 8 p.m.	does not drink	do not drink	am not drink	not drink	B	Với I dùng do not + động từ nguyên thể.
afa7fbb5-eed0-47bb-b07f-3099f0720f95	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	___ they live near the school?	Does	Are	Do	Is	C	They dùng trợ động từ do trong câu hỏi hiện tại đơn.
7f9a0383-5588-4bbf-8ae7-d73f709d8466	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	The museum ___ at 9 a.m. every day.	open	opens	is opening	opened	B	Lịch trình cố định dùng hiện tại đơn, museum số ít nên opens.
7d849dad-c16a-4eae-a85d-744a8bd434b3	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	She rarely ___ fast food.	eat	eats	eating	ate	B	Rarely là trạng từ tần suất; she dùng eats.
dd62d383-040d-4dc7-bc86-78cfc0b3f613	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	Cats ___ milk.	likes	like	are liking	liked	B	Cats là danh từ số nhiều nên động từ giữ nguyên.
babbbd68-5b06-4dab-a5a1-347012b5bdf5	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	He ___ have a car.	don't	doesn't	isn't	aren't	B	He dùng doesn't + động từ nguyên thể.
a5788b5c-d83e-49b0-bdc9-ea1a70eb7297	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	Where ___ your parents work?	do	does	are	is	A	Your parents là số nhiều nên dùng do.
ed3f3c22-e191-45b6-9eab-145e09817edf	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	The sun ___ in the east.	rise	rises	is rising	rose	B	Sự thật hiển nhiên dùng hiện tại đơn.
69ab0d07-701f-4728-97e8-26a0679ca0ff	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	My teacher ___ three languages.	speak	speaks	speaking	is speak	B	Teacher số ít nên speak thêm -s.
994c2e20-bf5e-4536-aab8-d1fdaa6e4003	9e91d53c-79f4-4d39-88b1-e371f22faf60	I ___ this movie before.	see	saw	have seen	am seeing	C	Before nói về trải nghiệm đến hiện tại, dùng have seen.
f790649d-5f2f-40ff-89ed-afa0e04baed2	9e91d53c-79f4-4d39-88b1-e371f22faf60	She ___ her homework yet.	hasn't finished	didn't finish	isn't finishing	doesn't finish	A	Yet thường dùng trong phủ định/nghi vấn hiện tại hoàn thành.
d6788406-25db-4496-bedd-856c59e632e2	9e91d53c-79f4-4d39-88b1-e371f22faf60	They ___ here since 2020.	live	lived	have lived	are living	C	Since + mốc thời gian dùng hiện tại hoàn thành.
5f475df0-6f40-4c9e-ac76-ca09fb71cbf5	9e91d53c-79f4-4d39-88b1-e371f22faf60	We have studied English ___ five years.	since	for	already	yet	B	For đi với khoảng thời gian.
700ddf35-0d67-48c3-9784-2e5ca52bf094	9e91d53c-79f4-4d39-88b1-e371f22faf60	Have you ___ eaten sushi?	never	ever	yet	already	B	Ever dùng trong câu hỏi về trải nghiệm.
1272bc8c-dd6e-44f8-b1d0-fde2aecb3583	9e91d53c-79f4-4d39-88b1-e371f22faf60	He has ___ left the office.	yet	ever	just	since	C	Just diễn tả hành động vừa mới xảy ra.
a162e03b-40dd-42b9-b890-817d616ae908	9e91d53c-79f4-4d39-88b1-e371f22faf60	My phone ___ working.	stopped	has stopped	stops	is stopping	B	Kết quả hiện tại là điện thoại không hoạt động, dùng has stopped.
53f775ca-0f94-4add-987c-9025730aad6c	9e91d53c-79f4-4d39-88b1-e371f22faf60	She has never ___ to Japan.	be	was	been	being	C	Present perfect dùng have/has + V3.
2c1c645e-784a-4ae3-a3c7-9c271fcd5193	9e91d53c-79f4-4d39-88b1-e371f22faf60	How long ___ you known him?	do	did	have	are	C	How long với sự việc còn liên quan hiện tại dùng have known.
9ee1891c-4303-409c-ba50-d08bccd1bb55	9e91d53c-79f4-4d39-88b1-e371f22faf60	The train ___ already arrived.	is	has	was	does	B	Already thường đi với has/have + V3.
d95871c2-e171-42ff-91b0-6fc57c0af5b4	22f8f287-7934-484c-86cc-25caa5320092	I think it ___ rain tomorrow.	is	will	does	was	B	Dự đoán thường dùng will.
2f777bf1-4325-494f-bf7a-bf40dd74e9b9	22f8f287-7934-484c-86cc-25caa5320092	She ___ call you later.	will	is	does	has	A	Will + động từ nguyên thể.
c59ca3c1-f8cf-4201-b45a-fd673ab1dafb	22f8f287-7934-484c-86cc-25caa5320092	Look at those clouds. It ___ rain.	will	is going to	does	was	B	Dự đoán dựa vào dấu hiệu hiện tại dùng be going to.
4a49b498-f4a2-46d5-b4b1-0ddacd717634	22f8f287-7934-484c-86cc-25caa5320092	I promise I ___ be late.	won't	don't	am not	didn't	A	Lời hứa dùng will/won't.
6692f8b9-e077-4ac2-80b6-07938d0eeb0c	22f8f287-7934-484c-86cc-25caa5320092	We ___ visit our grandparents this weekend.	are going to	will to	going	do	A	Kế hoạch đã có trước dùng be going to.
98c56275-2bf3-4845-a55d-dbca5f701554	22f8f287-7934-484c-86cc-25caa5320092	Will you ___ me with this box?	helping	helps	help	helped	C	Sau will dùng động từ nguyên thể.
abe21efe-5e7b-496e-bbd1-43f37294667a	22f8f287-7934-484c-86cc-25caa5320092	The phone is ringing. I ___ answer it.	am going to	will	am	did	B	Quyết định ngay lúc nói dùng will.
d14ebc13-4905-491c-935a-434dc9781812	22f8f287-7934-484c-86cc-25caa5320092	They ___ not finish on time.	will	are	do	have	A	Phủ định tương lai đơn: will not + V.
d3f21dba-55af-48eb-8f87-fcac241032e1	22f8f287-7934-484c-86cc-25caa5320092	___ she join us for dinner?	Does	Is	Will	Did	C	Câu hỏi tương lai đơn dùng will đứng đầu.
e81094ff-e26a-453f-bc40-a9462bd8af84	22f8f287-7934-484c-86cc-25caa5320092	He is saving money because he ___ buy a laptop.	will	is going to	does	has	B	Dự định có trước dùng be going to.
ee4a09c1-8191-4440-b9f3-96e91894a32b	ae1a29d5-7711-46ff-bfed-f66c51979174	You ___ wear a helmet on a motorbike.	can	must	might	would	B	Must diễn tả bắt buộc mạnh.
8fcd7e7d-33d0-4826-b717-20fe4b77277a	ae1a29d5-7711-46ff-bfed-f66c51979174	She ___ speak three languages.	can	must	should	may	A	Can diễn tả khả năng.
f2a7a8b3-8b07-4083-aeaa-e0c2b7e1b179	ae1a29d5-7711-46ff-bfed-f66c51979174	You ___ see a doctor if you feel worse.	can	should	mustn't	may	B	Should dùng cho lời khuyên.
143a2a2e-7973-4090-9721-6edeb751aebe	ae1a29d5-7711-46ff-bfed-f66c51979174	He ___ be at home. The lights are off.	must	can	might	should	C	Might diễn tả khả năng không chắc chắn.
93ac3773-985d-4470-bef9-30e35a565a27	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	She ___ to school every day.	goes	go	going	gone	A	Chủ ngữ "She" là ngôi 3 số ít → động từ thêm -es. "go" → "goes".
fc969b82-ba92-436b-8f80-e902a5acd96b	ae1a29d5-7711-46ff-bfed-f66c51979174	Students ___ use phones during the exam.	mustn't	don't have to	may	could	A	Mustn't là cấm.
bab017c0-b644-4fef-91d8-63e1ff5ebd8d	ae1a29d5-7711-46ff-bfed-f66c51979174	You ___ finish it today; tomorrow is fine.	must	mustn't	don't have to	can't	C	Don't have to nghĩa là không cần thiết.
619c24f1-84db-4ed4-b1d8-d22a63761f77	ae1a29d5-7711-46ff-bfed-f66c51979174	Could you ___ the window?	open	to open	opening	opened	A	Sau modal dùng động từ nguyên thể không to.
f887fe47-8fd3-4483-9882-3a79aae15eaf	ae1a29d5-7711-46ff-bfed-f66c51979174	It ___ rain later, so take an umbrella.	should	might	must	can't	B	Might dùng cho khả năng.
895b9826-ce39-4f88-9949-bdcbaab4d148	ae1a29d5-7711-46ff-bfed-f66c51979174	You ___ smoke in this room.	can	should	mustn't	may	C	Mustn't diễn tả điều bị cấm.
f5616fb1-8163-4d54-808a-21dcd4b011c3	ae1a29d5-7711-46ff-bfed-f66c51979174	We ___ be quiet in the library.	should	might	can	would	A	Should phù hợp với lời khuyên/quy tắc lịch sự.
88b0f8aa-12a9-4f64-9f2c-fbd43f956e44	165b74f8-2224-4556-bf9a-8f3aadea49fd	This book is ___ than that one.	interesting	more interesting	most interesting	interestinger	B	Tính từ dài dùng more + adjective.
03a7eabc-5775-4beb-95fa-53363fab73fe	165b74f8-2224-4556-bf9a-8f3aadea49fd	She is the ___ student in class.	good	better	best	well	C	So sánh nhất bất quy tắc: good -> best.
9736c0eb-ac55-4f6d-b09c-ecdea266d9f7	165b74f8-2224-4556-bf9a-8f3aadea49fd	My bag is ___ than yours.	heavy	heavier	heaviest	more heavy	B	Heavy đổi y thành i rồi thêm -er.
3e239e91-52e9-420c-a099-efe6196da04d	165b74f8-2224-4556-bf9a-8f3aadea49fd	This is the ___ movie I have ever seen.	bad	worse	worst	more bad	C	Bad -> worse -> worst.
e59e4bb7-dce9-45bc-aff1-abcfa55f0cd9	165b74f8-2224-4556-bf9a-8f3aadea49fd	He runs ___ than his brother.	fast	faster	fastest	more fast	B	Tính từ/trạng từ ngắn fast thêm -er.
d373043a-a69c-496c-8111-ec596d07ac8d	165b74f8-2224-4556-bf9a-8f3aadea49fd	The Nile is one of the ___ rivers in the world.	long	longer	longest	more long	C	One of the + superlative + danh từ số nhiều.
290bdc02-72c2-4bf7-96dd-1036e1928e6d	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	Water ___ at 100 degrees Celsius.	boil	boils	boiling	is boiling	B	"Water" là ngôi 3 số ít, diễn tả sự thật hiển nhiên → dùng HTĐ, V thêm -s.
de7e8b71-9c7a-47bb-95b9-e5e56a9fcb99	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	___ your father ___ coffee in the morning?	Do / drinks	Does / drink	Does / drinks	Is / drinking	B	Ngôi 3 số ít dùng "Does" + V nguyên thể (không thêm s). "Does ăn hết chữ S".
bd0e2afe-5204-4ee5-846a-cad28d146c19	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	They never ___ late for class.	arrives	arrive	arriving	are arrive	B	"They" là ngôi thứ 3 số nhiều → V giữ nguyên, không thêm s.
0f6b53ca-77e5-4506-8080-59d2c675e217	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	My sister ___ (study) English every evening.	studys	studies	study	studying	B	"study" kết thúc bằng phụ âm + y → bỏ y, thêm -ies: "studies".
7566a2f6-15bf-4fc4-b976-d95d85adea34	1390d58f-d902-4d8a-a6cc-e455e66c25e7	Look! The children ___ in the garden.	play	plays	are playing	played	C	"Look!" là dấu hiệu của HTTD. Hành động đang xảy ra → are + V-ing.
4206c548-c19e-4e8e-acf1-15141212cc23	1390d58f-d902-4d8a-a6cc-e455e66c25e7	She ___ (write) an email at the moment.	writes	is writing	write	was writing	B	"at the moment" → HTTD. "write" bỏ e + ing = writing.
599ba327-1efb-4536-85a0-b59cf18daf80	1390d58f-d902-4d8a-a6cc-e455e66c25e7	I ___ (not/watch) TV right now. I ___ (study).	don't watch / study	am not watching / am studying	not watch / studying	doesn't watch / studies	B	"right now" → HTTD: am not watching / am studying.
cc873ee0-74e7-466f-85af-7096bf6542fd	1390d58f-d902-4d8a-a6cc-e455e66c25e7	We ___ dinner with friends tonight. (Kế hoạch đã lên lịch)	have	has	are having	will have	C	HTTD dùng cho kế hoạch đã sắp xếp trong tương lai gần.
38355289-d53f-4990-858d-4d839ed5c5f5	1390d58f-d902-4d8a-a6cc-e455e66c25e7	Chọn câu SAI:	I am loving this song.	She is reading a book.	They are playing tennis.	We are waiting for the bus.	A	"love" là stative verb, không dùng thì tiếp diễn. Phải nói: "I love this song."
bf8d7b7b-03b3-4762-9b97-def45868efd0	9e91d53c-79f4-4d39-88b1-e371f22faf60	I ___ (live) in Saigon since 2018.	lived	have lived	am living	was living	B	"since 2018" → HTHT: have/has + V3. Hành động kéo dài từ 2018 đến nay.
4ebec2ac-c6f4-4d4e-84e5-bdee5721a79c	9e91d53c-79f4-4d39-88b1-e371f22faf60	She ___ already ___ her report.	has / finished	have / finished	had / finished	is / finishing	A	"She" → has. "already" → HTHT. has already finished.
6cf332fc-3666-47ea-99bd-e7386fe2e214	9e91d53c-79f4-4d39-88b1-e371f22faf60	___ you ever ___ to London?	Have / been	Did / go	Have / gone	Were / going	A	"ever" → HTHT. "Have you ever been to...?" là câu hỏi kinh nghiệm chuẩn.
6916baa2-56ff-48c1-a0f8-5c6153f2f07a	9e91d53c-79f4-4d39-88b1-e371f22faf60	Chọn câu ĐÚNG:	I have seen that movie yesterday.	She has worked here for three years.	He have finished his project.	They has already left.	B	A sai (yesterday → QKĐ), C sai (He → has), D sai (They → have). B đúng: has + V3 + for 3 years.
d9b6f9a0-7439-4989-9354-92a5a4c20fcc	9e91d53c-79f4-4d39-88b1-e371f22faf60	We ___ each other ___ we were children.	knew / when	have known / since	know / for	are knowing / since	B	"since we were children" → HTHT. have known...since = biết nhau từ khi còn nhỏ.
043da75b-e290-4967-9c2a-05a3f71340b0	90ad11e3-ee89-49c2-a421-0ef502b8744a	She ___ (go) to the cinema last night.	goes	went	has gone	is going	B	"last night" → QKĐ. "go" là V bất quy tắc: go → went → gone.
fe26f678-e5fa-4ddb-9c61-dd3e2b63c91b	90ad11e3-ee89-49c2-a421-0ef502b8744a	I ___ (not/see) him yesterday.	didn't see	don't see	haven't seen	wasn't seeing	A	"yesterday" → QKĐ. Phủ định: didn't + V nguyên thể (see).
eaef7ec5-a3cb-4712-aab5-24b3967d3868	90ad11e3-ee89-49c2-a421-0ef502b8744a	___ you ___ (enjoy) the party?	Did / enjoy	Do / enjoy	Have / enjoyed	Were / enjoying	A	QKĐ nghi vấn: Did + S + V nguyên thể?
aa7350d7-c99c-4340-9bf5-8076a41d58e8	90ad11e3-ee89-49c2-a421-0ef502b8744a	They ___ (buy) a new house two years ago.	buy	buyed	bought	have bought	C	"two years ago" → QKĐ. "buy" là V bất quy tắc: buy → bought → bought.
08a65ac4-51a4-4383-8bfb-2e2ca2b0cc5b	90ad11e3-ee89-49c2-a421-0ef502b8744a	Chọn câu ĐÚNG:	She didn't liked the movie.	Did you went to school?	He doesn't came yesterday.	We didn't know the answer.	D	A: didn't like (bỏ d). B: Did you go (V nguyên thể). C: didn't come. D đúng: didn't know.
d1fc6277-7966-47ff-aaed-6a59a7e335d8	22f8f287-7934-484c-86cc-25caa5320092	I think she ___ the exam.	passes	will pass	is passing	passed	B	"I think" → dự đoán cá nhân → will + V nguyên thể.
00669d53-deb4-40dd-bf63-6102424ce53c	22f8f287-7934-484c-86cc-25caa5320092	Don't worry. I ___ you with your bags.	help	will help	am helping	helped	B	Lời hứa/đề nghị → will + V. Quyết định ngay lúc nói.
f7c4c93b-80f7-4f45-a37d-114d8212d990	22f8f287-7934-484c-86cc-25caa5320092	___ you ___ the door, please?	Will / close	Do / close	Are / closing	Did / close	A	Yêu cầu lịch sự → Will you + V nguyên thể?
7b234ea8-c295-4848-8ab4-832514492e0b	22f8f287-7934-484c-86cc-25caa5320092	Look at those dark clouds! It ___ rain.	will	is going to	shall	would	B	Có bằng chứng hiện tại (dark clouds) → dùng "be going to" chứ không phải "will".
14569707-a8ed-498b-8510-6b6c32cee80d	22f8f287-7934-484c-86cc-25caa5320092	She ___ 25 next month.	is	will be	is being	was	B	Sự kiện trong tương lai → will + be.
2eec7a8a-e4ce-4ee9-b9ac-1f9bca94dc5f	165b74f8-2224-4556-bf9a-8f3aadea49fd	Today is ___ than yesterday.	hot	hotter	hottest	more hot	B	Hot nhân đôi t rồi thêm -er.
83262b7a-f24c-42e4-a5af-772fd2fa7508	e088946a-b0cf-494c-9746-85e1420a95c1	If you heat water to 100°C, it ___.	will boil	boils	boiled	is boiling	B	Câu ĐK loại 0: cả 2 vế dùng HTĐ. Sự thật hiển nhiên.
d31a0d4e-f006-4795-b0dd-139999612551	e088946a-b0cf-494c-9746-85e1420a95c1	If it ___ tomorrow, we will stay at home.	rains	will rain	rained	is raining	A	CĐK loại 1: mệnh đề If dùng HTĐ, KHÔNG dùng will.
8eef9935-ed08-460e-b8df-34c27085796c	e088946a-b0cf-494c-9746-85e1420a95c1	If you don't study, you ___ the test.	fail	will fail	failed	are failing	B	CĐK loại 1: mệnh đề chính dùng will + V nguyên thể.
12ccf64d-d6c6-47e5-94b0-58bf51801c97	e088946a-b0cf-494c-9746-85e1420a95c1	Chọn câu SAI:	If it rains, the grass gets wet.	If you heat ice, it melts.	If she will come, I will be happy.	If I'm late, I'll call you.	C	C sai vì mệnh đề IF không dùng "will". Đúng: "If she comes..."
45fccfda-342d-4d9d-bb56-6cbf14cf8b5a	e088946a-b0cf-494c-9746-85e1420a95c1	If you ___ (mix) blue and yellow, you ___ (get) green.	mix / get	mix / will get	will mix / get	mixed / got	A	Sự thật luôn đúng → CĐK loại 0: cả 2 vế dùng HTĐ.
c341e084-7980-4ee1-8f1d-3f25a743bcb0	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If I ___ a bird, I would fly to the moon.	am	was	were	be	C	CĐK loại 2: to be → "were" cho tất cả các ngôi, kể cả "I".
3a904e95-2b8d-4557-827d-4ac44ae73c90	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If he ___ more money, he ___ a new car.	has / will buy	had / would buy	have / would buy	had / will buy	B	CĐK loại 2: If + V2 (had), would + V (buy).
c92d1573-bb03-4ae9-bcfb-5aa3bb0923fa	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If I were you, I ___ that job offer.	will accept	would accept	accept	accepted	B	"If I were you" → CĐK loại 2 → would + V nguyên thể.
c4d5d11b-f5bd-4c72-b49b-f6415b80ee83	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	Câu nào diễn tả điều KHÔNG CÓ THẬT ở hiện tại?	If it rains, I will stay home.	If I had a car, I would drive to work.	If you study, you will pass.	If you heat ice, it melts.	B	B là CĐK loại 2: giả định không có thật. Thực tế: Tôi KHÔNG có xe.
00920889-c308-4f9a-b86d-45b2792ef352	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	What ___ you ___ if you won the lottery?	will / do	would / do	do / do	did / do	B	"won" (V2) → CĐK loại 2 → would + V. "What would you do?"
3a1c93bb-4f17-4c00-a0a7-f7eb9c8daafe	898cd0be-8da5-413e-b201-5d622ac826de	If I ___ (know), I would have told you.	know	knew	had known	have known	C	CĐK loại 3: If + had + V3 (had known). Sự việc đã qua → không thể thay đổi.
fb166bc5-ba34-43f7-bde5-2569fd0868ec	898cd0be-8da5-413e-b201-5d622ac826de	If she had left earlier, she ___ the train.	will catch	would catch	would have caught	catches	C	CĐK loại 3: would have + V3 (would have caught).
61fd3952-397b-463c-8579-92e78761ea42	898cd0be-8da5-413e-b201-5d622ac826de	If they ___ harder, they would have won.	try	tried	had tried	have tried	C	CĐK loại 3: mệnh đề If dùng had + V3: "had tried".
ff329c69-de29-4c46-afac-27e1b9f6819c	898cd0be-8da5-413e-b201-5d622ac826de	Câu nào diễn tả sự HỐI TIẾC về quá khứ?	If I study, I will pass.	If I were you, I would go.	If I had known, I would have helped.	If it rains, the road gets wet.	C	C là CĐK loại 3: giả định trái với quá khứ, thể hiện sự hối tiếc.
ba1d8729-2780-4f22-b497-bee387edf372	898cd0be-8da5-413e-b201-5d622ac826de	I wouldn't have been late if I ___ up earlier.	wake	woke	had woken	would wake	C	CĐK loại 3: If + had + V3. "had woken" up earlier.
0a97b873-c4b4-4ce2-8732-da90d6e68188	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	This book ___ by millions of people.	reads	is read	is reading	has reading	B	Bị động HTĐ: is/are + V3. "read" → V3 = "read" (phát âm /red/). is read.
d6f9d8cc-ff8e-48a2-a56c-ea7bf71fdd02	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The house ___ (build) in 1990.	built	was built	is built	has been built	B	Bị động QKĐ: was/were + V3. "in 1990" → quá khứ → was built.
7dfe305f-ac08-44e4-bb5f-0f53fe63eec3	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	A new hospital ___ (build) in our city now.	is built	is being built	was built	has been built	B	"now" → HTTD bị động: is/are + being + V3 = is being built.
1877ed79-386e-4509-a082-bf956ab5b06d	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	All the cookies ___ (eat) by the children.	have been eaten	has been eaten	was eaten	are eating	A	"All the cookies" số nhiều → have been + V3 (eaten). HTHT bị động.
c8c93d24-173c-40e8-857a-f0b6dc150990	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	This report ___ by tomorrow.	must finish	must be finished	must be finish	must finished	B	Modal + bị động: must + be + V3 = "must be finished".
713b7379-9a8f-4c13-8804-f7ec2cab703a	8242916c-9535-4e55-893c-7d1338de5ea1	"I am a teacher." → She said she ___ a teacher.	is	was	were	be	B	Lùi thì: am → was.
e956fb39-6577-4e45-940a-3339103b0878	8242916c-9535-4e55-893c-7d1338de5ea1	"I will call you." → He said he ___ call me.	will	would	can	should	B	Lùi thì: will → would.
d2976f1f-5d43-437d-b5d4-3719c647d009	8242916c-9535-4e55-893c-7d1338de5ea1	"Do you speak English?" → She asked me ___ I ___ English.	if / spoke	that / speak	do / speak	if / will speak	A	Câu hỏi Yes/No → asked if/whether + S + V (lùi thì).
c3c2d165-d74c-415a-afa1-8290b056d9b7	8242916c-9535-4e55-893c-7d1338de5ea1	"Don't open the window." → He told me ___ the window.	don't open	not to open	to not open	not opening	B	Mệnh lệnh phủ định → told sb NOT TO + V.
af655a37-08b2-4d5f-937b-5882adad6b61	8242916c-9535-4e55-893c-7d1338de5ea1	"Where is the bank?" → She asked ___.	where is the bank	where the bank is	where was the bank	where the bank was	D	Câu hỏi gián tiếp: đảo lại trật tự S+V và lùi thì: is → was.
2407e559-603f-4b03-91b8-fcf0ed7e597b	ae1a29d5-7711-46ff-bfed-f66c51979174	You ___ drive without a license. It's against the law.	shouldn't	mustn't	don't have to	can't	B	Cấm (luật pháp) → mustn't. "shouldn't" chỉ là lời khuyên, "mustn't" là cấm.
82fc387e-5516-4696-bd8f-f1ba5255b373	ae1a29d5-7711-46ff-bfed-f66c51979174	You look sick. You ___ see a doctor.	must	should	can	might	B	Lời khuyên → should. Không bắt buộc nhưng nên làm.
30faf047-71f8-48fd-9842-71b46204adfc	ae1a29d5-7711-46ff-bfed-f66c51979174	It's Sunday. I ___ go to work today.	mustn't	don't have to	shouldn't	can't	B	= Không cần đi làm (vì Chủ nhật). don't have to = không cần.
9c55d75a-a4b0-4f7b-a2a9-450c548174b5	ae1a29d5-7711-46ff-bfed-f66c51979174	___ I use your phone, please?	Must	Should	May	Will	C	Xin phép lịch sự → May I...?
5fd4ee9c-4b20-4169-8b71-a9f4919c7c15	ae1a29d5-7711-46ff-bfed-f66c51979174	She ___ be at home. Her car is in the driveway.	must	should	can	might	A	Suy đoán chắc chắn (có bằng chứng: xe đỗ ở đó) → must.
75cc52fc-14ac-4305-98a6-c637a0cd0af2	165b74f8-2224-4556-bf9a-8f3aadea49fd	She is ___ than her sister.	more tall	taller	tallest	most tall	B	"tall" (1 âm tiết) → thêm -er: taller + than.
2d8f704f-bbac-42f5-83fa-3a197322dc19	165b74f8-2224-4556-bf9a-8f3aadea49fd	This is ___ movie I've ever seen.	the most exciting	more exciting	excitingest	most exciting	A	"exciting" (3 âm tiết) → the most + adj. Phải có "the" trước.
b0582302-9d4f-4bd9-812b-ab6452ca874d	165b74f8-2224-4556-bf9a-8f3aadea49fd	My English is getting ___ and ___.	good / good	better / better	gooder / gooder	best / best	B	Cấu trúc "more and more" / "adj-er and adj-er": better and better.
6e5256e8-b339-4e77-9394-a04c4b29faa1	165b74f8-2224-4556-bf9a-8f3aadea49fd	He runs ___ than me.	faster	more fast	fastest	more faster	A	"fast" (1 âm tiết) → faster. Không dùng "more fast".
26799ff4-e316-447a-bb0d-ef293f99e4c0	165b74f8-2224-4556-bf9a-8f3aadea49fd	She is as ___ as her mother.	beautiful	more beautiful	most beautiful	beautifuler	A	So sánh bằng: as + adj (nguyên thể) + as.
9cc0407b-67f0-4645-b982-8c05af26dbea	f826100c-a5d5-4963-8f8e-8023cb2024f8	The woman ___ lives next door is a teacher.	which	who	whose	where	B	Thay cho người (chủ ngữ) → who.
0a1c556a-13dc-4f4e-80e0-17e1de87e27e	f826100c-a5d5-4963-8f8e-8023cb2024f8	The book ___ you gave me was very interesting.	who	which	whose	where	B	Thay cho vật (tân ngữ) → which/that.
d89e1d4e-8c72-408d-84b5-c44b3ea560ef	1a03369b-236d-4c49-b873-04d19962f01a	The list of items ___ on the desk.	are	is	were	be	B	Chủ ngữ thật là list, số ít.
f140cfb2-edcd-42e3-9166-a709ee3ff20c	f826100c-a5d5-4963-8f8e-8023cb2024f8	That is the restaurant ___ we had dinner last night.	which	who	where	whose	C	Nơi chốn → where (= at which).
a53eead5-5bf6-43b5-b5b1-522fba0fbad4	f826100c-a5d5-4963-8f8e-8023cb2024f8	The man ___ car was stolen called the police.	who	which	whose	that	C	"car was stolen" = xe CỦA ai → sở hữu → whose.
0abaa2b8-bbc4-465a-b997-9af8e1e1e119	f826100c-a5d5-4963-8f8e-8023cb2024f8	I still remember the day ___ I graduated.	which	where	when	whose	C	Thời gian → when (= on which).
569ff1a6-841d-4202-8b2b-bc99b6cd4bcf	f49c9967-880b-49d0-b9ca-7ebe37dd0971	She is ___ honest woman.	a	an	the	-	B	"honest" h câm, âm đầu là nguyên âm /ɒ/ → dùng "an".
5f1e9232-74e8-4869-8a8b-388bd0f88010	f49c9967-880b-49d0-b9ca-7ebe37dd0971	I bought ___ new car. ___ car is blue.	a / The	an / The	the / A	a / A	A	Lần đầu nhắc → a. Đã biết → the.
58330124-df29-4191-9126-f56b3c08e592	f49c9967-880b-49d0-b9ca-7ebe37dd0971	___ Earth moves around ___ Sun.	A / a	An / the	The / the	- / -	C	Vật duy nhất (chỉ có 1) → the Earth, the Sun.
5fb28b7f-0318-4c7f-bb93-58a05cd5aaf3	f49c9967-880b-49d0-b9ca-7ebe37dd0971	He is ___ university student.	a	an	the	-	A	"university" phát âm /juː/ (bắt đầu bằng phụ âm) → dùng "a".
4dd4b5f7-a8c2-4ff2-bc00-232103177809	f49c9967-880b-49d0-b9ca-7ebe37dd0971	___ water is essential for life.	A	An	The	-	D	DT không đếm được nói chung → không dùng mạo từ (Ø).
874334c2-36d9-4c81-9f48-1afaeaf513ae	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	She was born ___ 1995.	on	in	at	by	B	Năm → in.
0ac3241c-122c-4171-aed9-92d2ba0ed238	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	The meeting is ___ Monday ___ 9 AM.	in / at	on / at	at / on	on / in	B	Thứ → on. Giờ → at.
908ba7f3-471f-474b-addb-661b3f409cc5	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	There is a picture ___ the wall.	in	on	at	by	B	Trên bề mặt tường → on the wall.
413ee182-2e64-4e4f-abf5-5c469ee7cfe3	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	I'll see you ___ Christmas Day.	in	on	at	by	B	Ngày lễ cụ thể (Christmas Day) → on. (Nhưng "at Christmas" khi nói chung)
de370e8a-e480-4c0b-b74c-ac0ad65948cf	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	She arrived ___ the airport ___ 6 PM.	in / on	at / at	on / in	at / in	B	Địa điểm cụ thể → at the airport. Giờ → at 6 PM.
68c9bbea-3856-42b3-8b8a-5a7ddeabaf8b	4f518c44-9b4d-42a4-bade-5b9350334d0f	She enjoys ___ (cook) Italian food.	cook	to cook	cooking	cooked	C	enjoy + V-ing. "enjoys cooking".
903c5d03-8b57-4b8c-860e-c8d574b7a112	4f518c44-9b4d-42a4-bade-5b9350334d0f	I decided ___ (change) my job.	changing	to change	change	changed	B	decide + to V. "decided to change".
f8e886f3-3379-415c-8743-6580f9476d6b	4f518c44-9b4d-42a4-bade-5b9350334d0f	He stopped ___ (smoke). Now he is healthier.	to smoke	smoking	smoke	smoked	B	stop + V-ing = dừng hẳn việc hút thuốc. "stopped smoking".
8efd7ce6-8fd5-4417-862e-a63a5f75d45c	4f518c44-9b4d-42a4-bade-5b9350334d0f	Don't forget ___ (bring) your passport tomorrow.	bringing	to bring	bring	brought	B	forget + to V = quên phải làm gì (chưa làm). "Don't forget to bring".
ef2d83f0-76df-42f7-86fd-79c5b5c0de4b	4f518c44-9b4d-42a4-bade-5b9350334d0f	She is interested ___ (learn) Japanese.	to learn	learning	in learning	for learning	C	interested IN + V-ing. "interested in learning".
96a7f7e1-0ca0-4152-94b3-9e34f81643e1	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	She is a doctor, ___?	isn't she	is she	doesn't she	does she	A	Khẳng định (is) → đuôi phủ định: isn't she.
a61770c0-d370-47ec-a957-4805029cb2a8	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	You can't drive, ___?	can't you	can you	do you	don't you	B	Phủ định (can't) → đuôi khẳng định: can you.
1c73eacf-6eac-4c2c-9419-b2656ff061c1	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	They went to Paris, ___?	didn't they	did they	don't they	weren't they	A	QKĐ khẳng định (went) → đuôi phủ định: didn't they.
9a8d32fb-1c43-4f92-8757-4b850df69e4f	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	Let's go to the cinema, ___?	don't we	do we	shall we	will we	C	Trường hợp đặc biệt: Let's → shall we.
8fd6bb97-5e2a-4fe8-a6e5-4d94689ff249	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	Nobody called, ___?	didn't they	did they	didn't he	don't they	B	"Nobody" = phủ định → đuôi khẳng định: did they.
69783f67-03cc-482f-8788-dd0e865d4a5c	1a03369b-236d-4c49-b873-04d19962f01a	Everyone ___ ready for the exam.	is	are	were	have	A	Everyone → luôn đi với V số ít → is.
69ed68b4-f3e8-4787-aef0-cf1ae19ce148	1a03369b-236d-4c49-b873-04d19962f01a	The news ___ very surprising.	is	are	were	have been	A	"news" tuy có -s nhưng là DT không đếm được → V số ít: is.
5039517f-2b5a-4321-914f-6b9f5a7a8ccc	1a03369b-236d-4c49-b873-04d19962f01a	Neither she nor her friends ___ coming to the party.	is	are	was	has	B	Neither...nor → chia theo CN gần nhất: "friends" (số nhiều) → are.
6d6f33b9-1732-46f3-965d-6ddac13fe587	1a03369b-236d-4c49-b873-04d19962f01a	A number of employees ___ absent today.	is	are	was	has	B	"A number of + N" → số nhiều → are. (≠ "The number of" → số ít)
7be201c6-9949-47f6-8f15-95943c52d0a8	1a03369b-236d-4c49-b873-04d19962f01a	The number of students in this class ___ 35.	is	are	were	have	A	"The number of..." → một con số cụ thể → số ít → is.
28d8544d-92ef-416d-ab90-d834b25f969c	165b74f8-2224-4556-bf9a-8f3aadea49fd	This exercise is ___ difficult than the last one.	most	more	much	very	B	So sánh hơn với tính từ dài dùng more.
e58ba2e9-f69c-47b8-b5d0-3a96780358b8	165b74f8-2224-4556-bf9a-8f3aadea49fd	Mount Everest is the ___ mountain in the world.	high	higher	highest	more high	C	So sánh nhất dùng the highest.
02b7df9b-0593-4dd1-88e6-90bdc08066e1	165b74f8-2224-4556-bf9a-8f3aadea49fd	Her answer is ___ than mine.	clear	clearer	clearest	most clear	B	Clear có thể dùng clearer trong so sánh hơn.
d137384f-b22e-435b-8f3f-47e8fc245f47	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If I ___ rich, I would travel the world.	am	were	will be	be	B	Giả định hiện tại dùng were.
b4ba583a-4159-4818-9cfd-4c755e34125a	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	She would buy a house if she ___ enough money.	has	had	will have	have	B	If + past simple trong điều kiện loại 2.
642b8d9f-f045-42da-baed-e8a0a264bd24	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If he studied harder, he ___ better results.	gets	got	would get	will get	C	Mệnh đề chính dùng would + V.
1f7fcb7a-2889-47f0-a359-20240f24277c	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	What would you do if you ___ a wallet?	find	found	will find	are finding	B	Tình huống giả định dùng past simple.
d5899851-0ca6-45e3-be9e-20365a262f40	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If I were you, I ___ apologize.	will	would	do	am	B	If I were you là cấu trúc lời khuyên giả định.
5b3bf0b8-9560-420f-8cd6-94a438f98063	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	They ___ happier if they had more free time.	are	will be	would be	were	C	Kết quả giả định dùng would be.
26617119-48d8-435e-bb47-88870b346924	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If she didn't live far away, we ___ her more often.	visit	visited	would visit	will visit	C	Điều kiện không thật ở hiện tại dùng would + V.
8e27ff46-a1b2-4e82-8708-44526ced82a7	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If I ___ speak French, I would work in Paris.	can	could	will	am able	B	Could dùng như dạng quá khứ giả định của can.
23a70ec3-05ed-4548-bec9-07f16bbcc0f4	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	He would exercise more if he ___ busy.	isn't	wasn't	weren't	won't be	C	Văn phong chuẩn thường dùng weren't cho giả định.
618e5b41-279a-43f2-aa75-cf48279a9ac4	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If we had a car, we ___ to the beach.	drive	drove	would drive	will drive	C	Kết quả giả định dùng would drive.
2d83dce0-c9cb-42db-aeba-f2aa0ae5c1d3	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The room ___ every day.	cleans	is cleaned	cleaned	is cleaning	B	Bị động hiện tại đơn: am/is/are + V3.
e57b9a44-81d1-40d1-a071-187c76474727	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The cake ___ by my mother yesterday.	made	was made	is made	makes	B	Bị động quá khứ đơn: was/were + V3.
85149394-578a-4efd-9bcb-2cd6a9381373	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	English ___ in many countries.	speaks	is spoken	spoke	is speaking	B	English là đối tượng được nói, dùng bị động.
af4a4323-fe87-4521-b615-41fc54a84224	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The windows ___ right now.	are cleaning	clean	are being cleaned	were cleaned	C	Bị động hiện tại tiếp diễn: am/is/are being + V3.
db71d457-14d4-4f8c-8b85-252c9ee3603e	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	This report ___ by Friday.	will finish	will be finished	finished	is finishing	B	Bị động tương lai: will be + V3.
cce3cb35-e28f-40c9-bde6-f4510f2f01d9	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The letters ___ already ___.	have / sent	have been / sent	are / send	were / send	B	Bị động hiện tại hoàn thành: have/has been + V3.
32d1be16-11b1-4036-a976-9c60a5416e83	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	A new school ___ next year.	builds	will build	will be built	built	C	School được xây, dùng bị động tương lai.
62403196-35fa-4021-a141-a759a8265758	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The car ___ repaired now.	is being	has	was	will	A	Now + bị động tiếp diễn: is being repaired.
b56c0530-3f91-47cf-ac03-c38400a76064	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The problem can ___ solved easily.	be	is	being	been	A	Sau modal trong bị động dùng be + V3.
d082d1ea-34de-4041-8b10-67b23c53a04b	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	Romeo and Juliet ___ by Shakespeare.	wrote	was written	is writing	were written	B	Tên tác phẩm số ít, dùng was written.
c4f318db-04a4-476d-b514-6cdde0720b03	8242916c-9535-4e55-893c-7d1338de5ea1	He said, "I am tired." -> He said that he ___ tired.	is	was	were	be	B	Am lùi thì thành was.
daa33ce7-0f72-4714-a155-b4de394af260	8242916c-9535-4e55-893c-7d1338de5ea1	She said, "I like tea." -> She said that she ___ tea.	likes	liked	has liked	will like	B	Present simple lùi thành past simple.
01b05bf2-e747-41ec-8441-bf7c6e099d09	8242916c-9535-4e55-893c-7d1338de5ea1	"I will call you," Tom said. -> Tom said he ___ call me.	will	would	can	did	B	Will lùi thành would.
030505af-1a26-4b03-b082-c904c7f9e4c9	8242916c-9535-4e55-893c-7d1338de5ea1	He asked me, "Where do you live?" -> He asked me where I ___.	do live	did live	lived	am living	C	Câu hỏi gián tiếp dùng trật tự câu kể.
45419907-fe09-40ee-923a-4350d53b8540	8242916c-9535-4e55-893c-7d1338de5ea1	She asked, "Are you ready?" -> She asked if I ___ ready.	am	was	were	be	B	Yes/no question dùng if/whether và lùi thì.
1f227536-2ebf-4340-996e-6fe25b08592f	8242916c-9535-4e55-893c-7d1338de5ea1	He said, "I have finished." -> He said he ___ finished.	has	had	was	would	B	Present perfect lùi thành past perfect.
8374aa99-774b-49b9-b30a-da051986b902	8242916c-9535-4e55-893c-7d1338de5ea1	"Don't be late," she said. -> She told me ___ late.	don't be	not be	not to be	to not	C	Mệnh lệnh phủ định: told + object + not to V.
00e4737a-0bdf-4adb-88d3-3dc9a66e9ac7	8242916c-9535-4e55-893c-7d1338de5ea1	"Please sit down," he said. -> He asked me ___ down.	sit	to sit	sat	sitting	B	Lời yêu cầu: asked + object + to V.
8c42aeaf-b26a-471b-84bd-2c29e3dd4b19	8242916c-9535-4e55-893c-7d1338de5ea1	Today usually changes to ___ in reported speech.	that day	this day	the next day	yesterday	A	Today đổi thành that day khi tường thuật.
eaa883df-f4bb-4f3f-ad00-a178d905d00f	8242916c-9535-4e55-893c-7d1338de5ea1	Here usually changes to ___ in reported speech.	there	then	that	this	A	Here thường đổi thành there.
834dafbb-63bb-41c2-86e5-8c6a4aa36a4f	f826100c-a5d5-4963-8f8e-8023cb2024f8	The man ___ lives next door is a doctor.	which	who	where	when	B	Who dùng cho người.
4b7cb04a-af98-45ce-9569-94cacd770bc4	f826100c-a5d5-4963-8f8e-8023cb2024f8	This is the book ___ I bought yesterday.	who	where	which	when	C	Which dùng cho vật.
2c937247-6066-4265-846d-cd990271a173	f826100c-a5d5-4963-8f8e-8023cb2024f8	The girl ___ bag was stolen is crying.	who	which	whose	where	C	Whose chỉ sở hữu.
b5b474f6-89b6-4144-9313-5509e8aa4b0a	f826100c-a5d5-4963-8f8e-8023cb2024f8	The cafe ___ we met is closed now.	where	who	which	whose	A	Where dùng cho nơi chốn.
ce5f9230-fb19-4417-a010-61b5ffb385c3	f826100c-a5d5-4963-8f8e-8023cb2024f8	I remember the day ___ we first met.	where	when	who	which	B	When dùng cho thời gian.
78fa3fd2-1071-4e18-8357-d45809a7d9c1	f826100c-a5d5-4963-8f8e-8023cb2024f8	The teacher ___ teaches math is very kind.	which	who	where	when	B	Đại từ quan hệ là chủ ngữ chỉ người nên dùng who.
d206db29-d761-4b96-9228-2f59b7e4d11a	f826100c-a5d5-4963-8f8e-8023cb2024f8	The laptop ___ is on the desk is mine.	who	which	where	whose	B	Which làm chủ ngữ chỉ vật.
0f1e6a62-738f-46c8-8d32-7db1e0ce3331	f826100c-a5d5-4963-8f8e-8023cb2024f8	That is the house ___ my grandparents live.	who	which	where	whose	C	Where thay cho in which chỉ nơi ở.
1c3b2b38-47c8-40a6-8d3e-18e5f8538387	f826100c-a5d5-4963-8f8e-8023cb2024f8	The boy ___ you met yesterday is my cousin.	who	which	where	when	A	Who dùng cho người làm tân ngữ.
501ef91f-5626-437a-9444-089e16f7feb3	f826100c-a5d5-4963-8f8e-8023cb2024f8	The movie ___ we watched was exciting.	who	which	where	whose	B	Which dùng cho vật/sự việc.
e5299f4b-eeaa-4530-841e-2f5bea583802	4f518c44-9b4d-42a4-bade-5b9350334d0f	I enjoy ___ books.	read	to read	reading	reads	C	Enjoy theo sau bởi V-ing.
bfecf8c8-3bc4-498f-9b80-eebc92c6c0f0	4f518c44-9b4d-42a4-bade-5b9350334d0f	She decided ___ abroad.	study	to study	studying	studied	B	Decide theo sau bởi to + V.
4c952032-a3f9-43a8-9e16-f3e88f4fb52b	4f518c44-9b4d-42a4-bade-5b9350334d0f	He is interested in ___ English.	learn	to learn	learning	learned	C	Sau giới từ in dùng V-ing.
8e68f182-5408-4ace-9cfc-239892c6baf4	4f518c44-9b4d-42a4-bade-5b9350334d0f	They want ___ a new car.	buy	to buy	buying	bought	B	Want theo sau bởi to + V.
3a51fe36-230c-46a2-b46c-8bed520c100e	4f518c44-9b4d-42a4-bade-5b9350334d0f	I avoid ___ late at night.	drive	to drive	driving	drove	C	Avoid theo sau bởi V-ing.
964bbd1c-0a48-45cc-b6a8-db9deeefc2a7	4f518c44-9b4d-42a4-bade-5b9350334d0f	We hope ___ you soon.	see	to see	seeing	saw	B	Hope theo sau bởi to + V.
dc31572c-3f9d-4b53-b0cf-a47dfb7825ce	4f518c44-9b4d-42a4-bade-5b9350334d0f	She suggested ___ a break.	take	to take	taking	took	C	Suggest theo sau bởi V-ing.
db3b7793-fb57-44a0-917e-e74b889abcbf	4f518c44-9b4d-42a4-bade-5b9350334d0f	I need ___ this report today.	finish	to finish	finishing	finished	B	Need theo sau bởi to + V khi chủ ngữ là người cần làm việc.
92c1e530-deee-4d62-869b-2290081350fb	4f518c44-9b4d-42a4-bade-5b9350334d0f	He stopped ___ because he was tired.	work	to work	working	worked	C	Stop + V-ing nghĩa là dừng hành động đang làm.
d4a2cf57-5b65-46d6-bacd-569b204f6684	4f518c44-9b4d-42a4-bade-5b9350334d0f	She went to the shop ___ some milk.	buy	to buy	buying	bought	B	To + V diễn tả mục đích.
68737dde-7100-470c-b5b0-9c3e19825063	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	You are a student, ___?	are you	aren't you	do you	don't you	B	Mệnh đề chính khẳng định với are, đuôi phủ định là aren't you.
47525f04-4671-478b-bf65-84ea05e198b6	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	She doesn't like coffee, ___?	does she	doesn't she	is she	isn't she	A	Mệnh đề phủ định thì đuôi khẳng định.
1e8a3e1a-fb65-43f4-860b-254aa4166236	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	He can swim, ___?	can he	can't he	does he	doesn't he	B	Dùng lại modal can ở đuôi.
102ad311-6812-4597-a3d2-3e97c6180cf6	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	They went home, ___?	did they	didn't they	do they	don't they	B	Past simple khẳng định dùng didn't ở đuôi.
c80194ab-3fae-409d-a5e1-9efc745d1515	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	I am late, ___?	am I	aren't I	don't I	isn't I	B	Trường hợp đặc biệt: I am -> aren't I.
ea0e5eca-6700-4258-8793-6eabbc2acc99	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	Let's go, ___?	will we	shall we	do we	are we	B	Let's dùng tag shall we.
1dd20b56-9ff3-4c4f-8f31-040d641687b1	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	Don't be noisy, ___?	do you	will you	are you	don't you	B	Câu mệnh lệnh thường dùng will you.
9409b257-40ab-4431-88d3-d5165f8e9b70	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	There is a bank near here, ___?	is there	isn't there	does there	doesn't there	B	There is dùng tag isn't there.
9bacc1c8-c252-4aff-aade-c18a2f313bfd	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	She has finished, ___?	has she	hasn't she	does she	did she	B	Present perfect dùng has/have trong question tag.
26495917-580f-4dc4-ac90-1e17a54f39a7	1a03369b-236d-4c49-b873-04d19962f01a	Each student ___ a book.	have	has	are having	were	B	Each đi với động từ số ít.
45dcdee7-8809-400c-8cbc-08d34fb01c0c	1a03369b-236d-4c49-b873-04d19962f01a	My friends and I ___ ready.	am	is	are	be	C	Chủ ngữ ghép với and thường là số nhiều.
240f4e3a-1521-468e-970c-636a170d9d58	1a03369b-236d-4c49-b873-04d19962f01a	Neither answer ___ correct.	are	is	were	be	B	Neither thường đi với động từ số ít.
ebd21a7e-0f50-409a-b54d-97a672490ad5	1a03369b-236d-4c49-b873-04d19962f01a	The news ___ surprising.	are	is	were	be	B	News là danh từ số ít về mặt ngữ pháp.
fc8376f5-1c8e-4f02-bcc6-f299378f6f76	1a03369b-236d-4c49-b873-04d19962f01a	There ___ two chairs in the room.	is	are	was	be	B	Động từ hòa hợp với two chairs.
6f267d51-a23c-4872-9b9f-6243abf968c9	1a03369b-236d-4c49-b873-04d19962f01a	A number of students ___ absent.	is	are	was	be	B	A number of + danh từ số nhiều dùng động từ số nhiều.
f95afa5c-337f-4cad-aba8-c7085800d802	1a03369b-236d-4c49-b873-04d19962f01a	The number of students ___ increasing.	are	is	were	be	B	The number of là chủ ngữ số ít.
c500cd16-58ba-4ad2-a1db-8855f2ecef60	1a03369b-236d-4c49-b873-04d19962f01a	Either Tom or his brothers ___ coming.	is	are	was	be	B	Với either...or, động từ thường hòa hợp với chủ ngữ gần nhất.
44d3d73b-985e-428c-8741-1b93e6e3dd9d	1a03369b-236d-4c49-b873-04d19962f01a	Everyone ___ to join the club.	want	wants	are wanting	were wanting	B	Everyone là đại từ bất định số ít.
a52da1a0-f727-4ce1-848f-4b32788252f1	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	The bus leaves ___ noon.	in	on	at	to	C	At dùng với thời điểm cụ thể như noon.
fc5879d2-63b4-4d26-ba7a-15ed32b8e194	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	Open the door, ___?	do you	will you	are you	can you	B	Câu mệnh lệnh thường dùng will you ở question tag.
\.


--
-- Data for Name: grammartopics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grammartopics (id, categoryid, title, titlevi, content, orderindex) FROM stdin;
d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	46	Prepositions of Time & Place	Giới từ chỉ thời gian (in, on, at) và nơi chốn	<h3>Giới từ chỉ thời gian</h3><ul><li><strong>Giới từ</strong></li><li><strong>Dùng với</strong></li><li><strong>Ví dụ</strong></li><li><strong>IN</strong></li><li>Tháng, năm, mùa, buổi, thế kỷ</li><li>in May, in 2024, in summer, in the morning, in the 21st century</li><li><strong>ON</strong></li><li>Ngày, thứ, ngày lễ cụ thể</li><li>on Monday, on June 5th, on Christmas Day, on my birthday</li><li><strong>AT</strong></li><li>Giờ, thời điểm cụ thể</li><li>at 7 AM, at noon, at midnight, at night, at the weekend</li></ul><h3>Giới từ chỉ nơi chốn</h3><ul><li><strong>Giới từ</strong></li><li><strong>Dùng với</strong></li><li><strong>Ví dụ</strong></li><li><strong>IN</strong></li><li>Không gian 3D, bên trong</li><li>in the room, in Vietnam, in a box, in the car</li><li><strong>ON</strong></li><li>Bề mặt, trên</li><li>on the table, on the wall, on the 2nd floor, on the bus</li><li><strong>AT</strong></li><li>Một điểm cụ thể</li><li>at school, at the airport, at home, at the door</li></ul><h3>Ngoại lệ cần nhớ</h3><p><strong>at night</strong> (KHÔNG dùng in night)</p><p><strong>at the weekend</strong> (British) / <strong>on the weekend</strong> (American)</p><p><strong>in the morning/afternoon/evening</strong> NHƯNG <strong>at night</strong></p><p><strong>on the bus/train/plane</strong> NHƯNG <strong>in the car/taxi</strong></p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>At dùng cho điểm thời gian/nơi chốn cụ thể; on dùng cho ngày/bề mặt; in dùng cho khoảng/thể tích/khu vực.</li><li>Một số cụm cố định cần học như at night, on the weekend, in the morning.</li><li>Không dịch máy móc từng giới từ từ tiếng Việt sang tiếng Anh.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	0
e088946a-b0cf-494c-9746-85e1420a95c1	39	Zero & First Conditional	Câu điều kiện loại 0 & 1	<h3>Câu điều kiện loại 0 — Sự thật hiển nhiên</h3><ul><li><strong>Cấu trúc</strong></li><li><strong>If + S + V (HTĐ), S + V (HTĐ)</strong></li></ul><p>Dùng khi kết quả <strong>luôn luôn đúng</strong>, là sự thật khoa học hoặc quy luật tự nhiên.</p><p>If you <strong>heat</strong> ice, it <strong>melts</strong>. <em>(Nếu bạn đun nóng đá, nó tan.)</em></p><p>If you <strong>don't water</strong> plants, they <strong>die</strong>. <em>(Nếu bạn không tưới cây, chúng chết.)</em></p><h3>Câu điều kiện loại 1 — Có thể xảy ra ở hiện tại/tương lai</h3><ul><li><strong>Cấu trúc</strong></li><li><strong>If + S + V (HTĐ), S + will + V</strong></li></ul><p>Dùng khi điều kiện <strong>có thể xảy ra</strong> trong thực tế ở hiện tại hoặc tương lai.</p><p>If it <strong>rains</strong>, I <strong>will take</strong> an umbrella. <em>(Nếu trời mưa, tôi sẽ mang ô.)</em></p><p>If you <strong>study</strong> hard, you <strong>will pass</strong> the exam. <em>(Nếu bạn học chăm, bạn sẽ đỗ.)</em></p><p>If she <strong>doesn't hurry</strong>, she <strong>will miss</strong> the bus. <em>(Nếu cô ấy không nhanh lên, cô ấy sẽ lỡ xe buýt.)</em></p><h3>Lỗi sai thường gặp</h3><p>If it <strong>will rain</strong>, I will stay home. → If it <strong>rains</strong>... <em>(Mệnh đề IF không dùng "will"!)</em></p><p>If you <strong>will study</strong>... → If you <strong>study</strong>...</p><h3>Lưu ý quan trọng</h3><p><strong>Quy tắc vàng:</strong> Mệnh đề IF trong loại 0 và loại 1 <strong>KHÔNG BAO GIỜ</strong> dùng "will".</p><p>Mệnh đề IF luôn dùng <strong>Hiện tại đơn</strong>, chỉ mệnh đề chính mới dùng "will".</p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Loại 0 nói về sự thật chung: If + present simple, present simple.</li><li>Loại 1 nói về khả năng thật ở tương lai: If + present simple, will + V.</li><li>Không dùng will trong mệnh đề if của điều kiện loại 1.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	0
90ad11e3-ee89-49c2-a421-0ef502b8744a	38	Past Simple	Thì Quá Khứ Đơn	\n<h3>Định nghĩa</h3>\n<p>Thì Quá khứ đơn (Past Simple) diễn tả <b>hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ</b>, thường đi kèm với mốc thời gian cụ thể.</p>\n\n<h3>Cấu trúc chi tiết</h3>\n\n<ul><li><strong>Dạng câu</strong></li><li><strong>V thường</strong></li><li><strong>V to be</strong></li></ul>\n<ul><li><b>Khẳng định</b></li><li>S + V2/ed</li><li>S + was/were</li></ul>\n<ul><li><b>Phủ định</b></li><li>S + did not + V (nguyên thể)</li><li>S + was/were + not</li></ul>\n<ul><li><b>Nghi vấn</b></li><li>Did + S + V (nguyên thể)?</li><li>Was/Were + S...?</li></ul>\n\n\n<h3>📏 Quy tắc chia động từ có quy tắc thêm -ed</h3>\n\n<ul><li><strong>Quy tắc</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li>Hầu hết: thêm <b>-ed</b></li><li>play → play<b>ed</b>, work → work<b>ed</b></li></ul>\n<ul><li>Tận cùng -e: thêm <b>-d</b></li><li>live → live<b>d</b>, love → love<b>d</b></li></ul>\n<ul><li>Tận cùng phụ âm + y: đổi y → <b>-ied</b></li><li>study → stud<b>ied</b>, carry → carr<b>ied</b></li></ul>\n<ul><li>1 nguyên âm + 1 phụ âm (1 âm tiết): nhân đôi</li><li>stop → sto<b>pp</b>ed, plan → pla<b>nn</b>ed</li></ul>\n\n\n<h3>📋 Động từ bất quy tắc phổ biến</h3>\n\n<ul><li><strong>V1</strong></li><li><strong>V2</strong></li><li><strong>V3</strong></li><li><strong>Nghĩa</strong></li></ul>\n<ul><li>go</li><li><b>went</b></li><li>gone</li><li>đi</li></ul>\n<ul><li>come</li><li><b>came</b></li><li>come</li><li>đến</li></ul>\n<ul><li>eat</li><li><b>ate</b></li><li>eaten</li><li>ăn</li></ul>\n<ul><li>see</li><li><b>saw</b></li><li>seen</li><li>nhìn</li></ul>\n<ul><li>buy</li><li><b>bought</b></li><li>bought</li><li>mua</li></ul>\n<ul><li>take</li><li><b>took</b></li><li>taken</li><li>lấy</li></ul>\n<ul><li>give</li><li><b>gave</b></li><li>given</li><li>cho</li></ul>\n<ul><li>write</li><li><b>wrote</b></li><li>written</li><li>viết</li></ul>\n\n\n<h3>Cách dùng</h3>\n<p><b>1. Hành động đã xảy ra và kết thúc trong quá khứ:</b></p>\n<p>I <b>visited</b> my grandparents <b>last weekend</b>. <i>(Tôi đã thăm ông bà cuối tuần trước.)</i></p>\n<p>She <b>graduated</b> from university <b>in 2020</b>. <i>(Cô ấy tốt nghiệp đại học năm 2020.)</i></p>\n\n<p><b>2. Chuỗi hành động liên tiếp trong quá khứ:</b></p>\n<p>He <b>woke up</b>, <b>brushed</b> his teeth, and <b>had</b> breakfast. <i>(Anh ấy thức dậy, đánh răng và ăn sáng.)</i></p>\n\n<h3>Dấu hiệu nhận biết</h3>\n<p>\nyesterday, last night/week/month/year, ago (2 days ago), in 2019, when I was young, this morning (nếu đã qua)\n</p>\n\n<h3>Lỗi sai thường gặp</h3>\n<p>\nShe <b>didn't went</b>. → She <b>didn't go</b>. <i>(Sau didn't, V luôn ở nguyên thể)</i><br>\n<b>Did</b> you <b>went</b>? → <b>Did</b> you <b>go</b>? <i>(Sau Did, V ở nguyên thể)</i><br>\nI <b>goed</b> to school. → I <b>went</b> to school. <i>(go là V bất quy tắc)</i>\n</p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Dùng cho hành động đã kết thúc tại một thời điểm xác định trong quá khứ.</li><li>Câu phủ định/nghi vấn dùng did nên động từ chính về nguyên thể.</li><li>Phân biệt động từ có quy tắc thêm -ed và động từ bất quy tắc.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	3
898cd0be-8da5-413e-b201-5d622ac826de	39	Third Conditional	Câu điều kiện loại 3	\n<h3>Định nghĩa</h3>\n<p>Câu điều kiện loại 3 diễn tả <b>điều kiện không có thật trong quá khứ</b> — hối tiếc về điều đã xảy ra, giả định trái với quá khứ.</p>\n\n<h3>Cấu trúc</h3>\n\n<ul><li><strong>Cấu trúc</strong></li><li><strong>If + S + had + V3, S + would have + V3</strong></li></ul>\n\n\n<h3>Ví dụ</h3>\n<p>If I <b>had studied</b> harder, I <b>would have passed</b> the exam. <i>(Nếu tôi đã học chăm hơn, tôi đã đỗ kỳ thi.) → Thực tế: Tôi KHÔNG học chăm và KHÔNG đỗ.</i></p>\n<p>If she <b>had left</b> earlier, she <b>wouldn't have missed</b> the flight. <i>(Nếu cô ấy đã đi sớm hơn, cô ấy đã không lỡ chuyến bay.) → Thực tế: Cô ấy đi muộn và LỠ chuyến bay.</i></p>\n\n<h3>So sánh 3 loại câu điều kiện</h3>\n\n<ul><li><strong>Loại</strong></li><li><strong>Mệnh đề IF</strong></li><li><strong>Mệnh đề chính</strong></li><li><strong>Thực tế</strong></li></ul>\n<ul><li><b>Loại 1</b></li><li>V (HTĐ)</li><li>will + V</li><li>Có thể xảy ra</li></ul>\n<ul><li><b>Loại 2</b></li><li>V2/ed (QKĐ)</li><li>would + V</li><li>Không thật ở hiện tại</li></ul>\n<ul><li><b>Loại 3</b></li><li>had + V3 (QKHT)</li><li>would have + V3</li><li>Không thật ở quá khứ</li></ul>\n\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Dùng để nói về điều không xảy ra trong quá khứ và kết quả giả định của nó.</li><li>Cấu trúc chính: If + past perfect, would have + V3.</li><li>Không trộn past simple vào mệnh đề if khi nói điều kiện loại 3.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	2
f49c9967-880b-49d0-b9ca-7ebe37dd0971	45	Articles (A / An / The)	Mạo từ A, An, The và trường hợp không dùng mạo từ	\n<h3>Bảng quy tắc</h3>\n\n<ul><li><strong>Mạo từ</strong></li><li><strong>Khi nào dùng</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li><b>A</b></li><li>Trước DT đếm được số ít, bắt đầu phụ âm. Nhắc đến lần đầu.</li><li>I saw <b>a</b> dog.</li></ul>\n<ul><li><b>An</b></li><li>Trước DT đếm được số ít, bắt đầu nguyên âm (âm đọc).</li><li>She is <b>an</b> engineer. / <b>an</b> hour</li></ul>\n<ul><li><b>The</b></li><li>Cả 2 đều biết. Vật duy nhất. Đã nhắc đến trước đó.</li><li><b>The</b> sun. / I saw a dog. <b>The</b> dog was big.</li></ul>\n<ul><li><b>Ø (không dùng)</b></li><li>DT số nhiều / không đếm được khi nói chung.</li><li><b>Ø</b> Dogs are loyal. / <b>Ø</b> Water is important.</li></ul>\n\n\n<h3>Trường hợp đặc biệt</h3>\n<p>\n<b>an</b> honest person (h câm), <b>an</b> hour, <b>an</b> MBA<br>\n<b>a</b> university (phát âm /juː/), <b>a</b> European country (phát âm /jʊ/)<br>\n→ Quy tắc dựa vào <b>ÂM ĐỌC</b>, không phải chữ cái đầu.\n</p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>A/an dùng khi nhắc lần đầu hoặc nói một đối tượng chưa xác định.</li><li>The dùng khi người nghe đã biết đối tượng hoặc đối tượng là duy nhất trong ngữ cảnh.</li><li>Không dùng mạo từ với danh từ số nhiều/không đếm được khi nói chung.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	0
1390d58f-d902-4d8a-a6cc-e455e66c25e7	38	Present Continuous	Thì Hiện Tại Tiếp Diễn	\n<h3>Định nghĩa</h3>\n<p>Thì Hiện tại tiếp diễn (Present Continuous / Present Progressive) diễn tả <b>hành động đang xảy ra ngay tại thời điểm nói</b>, hoặc <b>hành động tạm thời</b> xung quanh thời điểm hiện tại, hoặc <b>kế hoạch đã lên lịch</b> trong tương lai gần.</p>\n\n<h3>Cấu trúc chi tiết</h3>\n\n<ul><li><strong>Dạng câu</strong></li><li><strong>Cấu trúc</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li><b>Khẳng định</b></li><li>S + am/is/are + V-ing</li><li>I <b>am reading</b> a book.</li></ul>\n<ul><li><b>Phủ định</b></li><li>S + am/is/are + not + V-ing</li><li>She <b>isn't watching</b> TV.</li></ul>\n<ul><li><b>Nghi vấn</b></li><li>Am/Is/Are + S + V-ing?</li><li><b>Are</b> you <b>listening</b>?</li></ul>\n\n\n<h3>📏 Quy tắc thêm -ing</h3>\n\n<ul><li><strong>Quy tắc</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li>Hầu hết: thêm <b>-ing</b></li><li>read → read<b>ing</b>, play → play<b>ing</b></li></ul>\n<ul><li>Tận cùng -e câm: bỏ e, thêm <b>-ing</b></li><li>make → mak<b>ing</b>, write → writ<b>ing</b></li></ul>\n<ul><li>Tận cùng 1 nguyên âm + 1 phụ âm (1 âm tiết): nhân đôi phụ âm</li><li>run → ru<b>nn</b>ing, sit → si<b>tt</b>ing, swim → swi<b>mm</b>ing</li></ul>\n<ul><li>Tận cùng -ie: đổi ie → y, thêm -ing</li><li>die → d<b>y</b>ing, lie → l<b>y</b>ing</li></ul>\n<ul><li>Tận cùng -ee: giữ nguyên, thêm -ing</li><li>see → see<b>ing</b>, agree → agree<b>ing</b></li></ul>\n\n\n<h3>Cách dùng chi tiết</h3>\n<p><b>1. Hành động đang diễn ra ngay lúc nói:</b></p>\n<p>Shhh! The baby <b>is sleeping</b>. <i>(Suỵt! Em bé đang ngủ.)</i></p>\n<p>Look! It <b>is raining</b> outside. <i>(Nhìn kìa! Trời đang mưa ngoài kia.)</i></p>\n\n<p><b>2. Hành động tạm thời (không phải thói quen):</b></p>\n<p>I usually drive to work, but today I <b>am taking</b> the bus. <i>(Tôi thường lái xe đi làm, nhưng hôm nay tôi đang đi xe buýt.)</i></p>\n<p>She <b>is staying</b> with her sister this week. <i>(Cô ấy đang ở cùng chị gái tuần này.)</i></p>\n\n<p><b>3. Kế hoạch chắc chắn trong tương lai gần:</b></p>\n<p>We <b>are meeting</b> the client at 3 PM tomorrow. <i>(Chúng tôi sẽ gặp khách hàng lúc 3 giờ chiều mai.)</i></p>\n<p>I <b>am flying</b> to Hanoi next Monday. <i>(Tôi bay ra Hà Nội thứ Hai tuần sau.)</i></p>\n\n<p><b>4. Xu hướng đang thay đổi:</b></p>\n<p>The population <b>is growing</b> rapidly. <i>(Dân số đang tăng nhanh chóng.)</i></p>\n<p>Online shopping <b>is becoming</b> more popular. <i>(Mua sắm trực tuyến đang trở nên phổ biến hơn.)</i></p>\n\n<h3>🚫 Động từ KHÔNG dùng với thì tiếp diễn (Stative Verbs)</h3>\n<p>\n<b>Cảm xúc:</b> love, hate, like, want, need, prefer<br>\n<b>Nhận thức:</b> know, believe, understand, remember, forget, think (= nghĩ rằng)<br>\n<b>Sở hữu:</b> have (= sở hữu), own, belong, possess<br>\n<b>Giác quan:</b> see, hear, smell, taste (khi mang nghĩa tự nhiên)<br>\nI <b>am knowing</b> the answer. → I <b>know</b> the answer.\n</p>\n\n<h3>Dấu hiệu nhận biết</h3>\n<p>\nnow, right now, at the moment, at present, currently, today, tonight, this week/month<br>\nCác cảm thán: <b>Look!</b>, <b>Listen!</b>, <b>Be quiet!</b>, <b>Watch out!</b>\n</p>\n\n<h3>Lỗi sai thường gặp</h3>\n<p>\nShe <b>is work</b> now. → She <b>is working</b> now. <i>(Thiếu -ing)</i><br>\nI <b>am wanting</b> a coffee. → I <b>want</b> a coffee. <i>(want là stative verb)</i><br>\nHe <b>is runing</b>. → He <b>is running</b>. <i>(run: nhân đôi phụ âm n)</i>\n</p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Dùng cho hành động đang diễn ra, việc tạm thời và kế hoạch gần đã sắp xếp.</li><li>Cấu trúc bắt buộc là am/is/are + V-ing.</li><li>Không dùng thì tiếp diễn với stative verbs như know, want, believe khi mang nghĩa trạng thái.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	1
9e91d53c-79f4-4d39-88b1-e371f22faf60	38	Present Perfect	Thì Hiện Tại Hoàn Thành	\n<h3>Định nghĩa</h3>\n<p>Thì Hiện tại hoàn thành (Present Perfect) diễn tả hành động <b>đã xảy ra trong quá khứ nhưng có liên quan đến hiện tại</b>, hoặc hành động <b>bắt đầu trong quá khứ và kéo dài đến hiện tại</b>.</p>\n\n<h3>Cấu trúc chi tiết</h3>\n\n<ul><li><strong>Dạng câu</strong></li><li><strong>Cấu trúc</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li><b>Khẳng định</b></li><li>S + have/has + V3 (past participle)</li><li>I <b>have finished</b> my homework.</li></ul>\n<ul><li><b>Phủ định</b></li><li>S + have/has + not + V3</li><li>She <b>hasn't eaten</b> lunch yet.</li></ul>\n<ul><li><b>Nghi vấn</b></li><li>Have/Has + S + V3?</li><li><b>Have</b> you ever <b>been</b> to Japan?</li></ul>\n\n<p><b>Lưu ý:</b> I/you/we/they → <b>have</b> | he/she/it → <b>has</b></p>\n\n<h3>Cách dùng chi tiết</h3>\n<p><b>1. Kinh nghiệm, trải nghiệm (không nói thời gian cụ thể):</b></p>\n<p>I <b>have visited</b> Paris three times. <i>(Tôi đã đến Paris ba lần.)</i></p>\n<p><b>Have</b> you ever <b>tried</b> sushi? <i>(Bạn đã bao giờ thử sushi chưa?)</i></p>\n<p>She <b>has never seen</b> snow. <i>(Cô ấy chưa bao giờ nhìn thấy tuyết.)</i></p>\n\n<p><b>2. Hành động vừa mới xảy ra (just, already, yet):</b></p>\n<p>He <b>has just arrived</b>. <i>(Anh ấy vừa mới đến.)</i></p>\n<p>I <b>have already done</b> my homework. <i>(Tôi đã làm xong bài tập rồi.)</i></p>\n<p><b>Has</b> the meeting <b>started</b> yet? <i>(Cuộc họp đã bắt đầu chưa?)</i></p>\n\n<p><b>3. Hành động kéo dài từ quá khứ đến hiện tại (since, for):</b></p>\n<p>I <b>have lived</b> here <b>since</b> 2010. <i>(Tôi đã sống ở đây từ năm 2010.)</i></p>\n<p>She <b>has worked</b> at this company <b>for</b> 5 years. <i>(Cô ấy đã làm việc ở công ty này được 5 năm.)</i></p>\n<p>We <b>have known</b> each other <b>since</b> childhood. <i>(Chúng tôi đã biết nhau từ nhỏ.)</i></p>\n\n<h3>Since vs For</h3>\n\n<ul><li><strong>SINCE (từ khi — mốc thời gian)</strong></li><li><strong>FOR (được — khoảng thời gian)</strong></li></ul>\n<ul><li>since 2020, since Monday, since I was a child, since last summer, since 8 AM</li><li>for 5 years, for 3 hours, for a long time, for two weeks, for ages</li></ul>\n\n\n<h3>Dấu hiệu nhận biết</h3>\n<p>\n<b>just</b> (vừa mới), <b>already</b> (đã...rồi), <b>yet</b> (chưa — dùng trong phủ định và nghi vấn)<br>\n<b>ever</b> (đã bao giờ), <b>never</b> (chưa bao giờ), <b>since</b> (từ khi), <b>for</b> (trong khoảng)<br>\n<b>so far</b> (cho đến nay), <b>up to now / until now</b> (cho đến bây giờ), <b>recently / lately</b> (gần đây)\n</p>\n\n<h3>Phân biệt HTHT vs Quá khứ đơn</h3>\n<p>\nI <b>have gone</b> to Paris <b>last year</b>. → I <b>went</b> to Paris last year. <i>(Có mốc thời gian cụ thể "last year" → dùng QKĐ)</i><br>\nI <b>have been</b> to Paris. <i>(Không nói khi nào → HTHT: kinh nghiệm)</i><br><br>\n<b>Quy tắc:</b> Có thời gian cụ thể trong quá khứ (yesterday, last week, in 2019...) → dùng <b>Past Simple</b>.<br>\nKhông có / không cần thời gian cụ thể → dùng <b>Present Perfect</b>.\n</p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Dùng cho trải nghiệm, kết quả còn liên quan hiện tại và hành động bắt đầu trong quá khứ còn tiếp tục.</li><li>Since đi với mốc thời gian, for đi với khoảng thời gian.</li><li>Already, yet, ever, never thường là tín hiệu quan trọng của thì này.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	2
22f8f287-7934-484c-86cc-25caa5320092	38	Future Simple	Thì Tương Lai Đơn	\n<h3>Định nghĩa</h3>\n<p>Thì Tương lai đơn (Future Simple) diễn tả <b>dự đoán</b>, <b>quyết định tại thời điểm nói</b>, <b>lời hứa</b>, <b>đề nghị</b>, hoặc <b>sự kiện sẽ xảy ra trong tương lai</b>.</p>\n\n<h3>Cấu trúc</h3>\n\n<ul><li><strong>Dạng câu</strong></li><li><strong>Cấu trúc</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li><b>Khẳng định</b></li><li>S + will + V (nguyên thể)</li><li>I <b>will call</b> you later.</li></ul>\n<ul><li><b>Phủ định</b></li><li>S + will not (won't) + V</li><li>She <b>won't come</b> tomorrow.</li></ul>\n<ul><li><b>Nghi vấn</b></li><li>Will + S + V?</li><li><b>Will</b> you <b>help</b> me?</li></ul>\n\n\n<h3>Cách dùng</h3>\n<p><b>1. Quyết định ngay tại thời điểm nói (spontaneous decision):</b></p>\n<p>[Chuông điện thoại reo] I<b>'ll answer</b> it. <i>(Tôi sẽ nghe máy.)</i></p>\n<p>I'm hungry. I <b>think I'll order</b> a pizza. <i>(Tôi đói. Tôi nghĩ tôi sẽ đặt pizza.)</i></p>\n\n<p><b>2. Lời hứa:</b></p>\n<p>I <b>will always love</b> you. <i>(Anh sẽ luôn yêu em.)</i></p>\n<p>I <b>promise I won't tell</b> anyone. <i>(Tôi hứa tôi sẽ không nói với ai.)</i></p>\n\n<p><b>3. Dự đoán (không có căn cứ rõ ràng):</b></p>\n<p>I <b>think</b> it <b>will rain</b> tomorrow. <i>(Tôi nghĩ ngày mai trời sẽ mưa.)</i></p>\n\n<p><b>4. Đề nghị, yêu cầu lịch sự:</b></p>\n<p><b>Will</b> you <b>open</b> the window, please? <i>(Bạn vui lòng mở cửa sổ được không?)</i></p>\n<p><b>Shall I help</b> you with that? <i>(Tôi giúp bạn việc đó nhé?)</i></p>\n\n<h3>Phân biệt Will vs Be going to</h3>\n\n<ul><li><strong>WILL</strong></li><li><strong>BE GOING TO</strong></li></ul>\n<ul><li>Quyết định ngay tại thời điểm nói</li><li>Kế hoạch, dự định đã có từ trước</li></ul>\n<ul><li>Dự đoán dựa trên ý kiến cá nhân</li><li>Dự đoán dựa trên bằng chứng hiện tại</li></ul>\n<ul><li><i>I'll have the chicken.</i> (vừa quyết định)</li><li><i>I'm going to visit Paris next month.</i> (đã lên kế hoạch)</li></ul>\n<ul><li><i>I think it will rain.</i> (dự đoán cá nhân)</li><li><i>Look at those clouds. It's going to rain.</i> (có bằng chứng)</li></ul>\n\n\n<h3>Dấu hiệu nhận biết</h3>\n<p>\ntomorrow, next week/month/year, I think/believe/hope, probably, perhaps, maybe, in the future, someday\n</p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Dùng will cho quyết định ngay lúc nói, dự đoán, lời hứa và đề nghị.</li><li>Dùng be going to cho dự định đã có trước hoặc dự đoán dựa trên dấu hiệu hiện tại.</li><li>Sau will luôn dùng động từ nguyên thể.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	4
ae1a29d5-7711-46ff-bfed-f66c51979174	42	Modal Verbs	Động từ khuyết thiếu: can, could, must, should, may, might	\n<h3>Đặc điểm chung</h3>\n<ul>\n<li>Luôn đi với <b>V nguyên thể</b> (không chia, không thêm to)</li>\n<li>Không có dạng V-ing, V3, hay thêm -s/-es</li>\n<li>Tự tạo phủ định (thêm not) và nghi vấn (đảo lên trước S)</li>\n</ul>\n\n<h3>Bảng tổng hợp</h3>\n\n<ul><li><strong>Modal</strong></li><li><strong>Nghĩa chính</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li><b>can</b></li><li>Có thể (khả năng), cho phép</li><li>I <b>can</b> swim. / You <b>can</b> go now.</li></ul>\n<ul><li><b>could</b></li><li>Có thể (quá khứ), lịch sự</li><li><b>Could</b> you help me? / I <b>could</b> read at age 5.</li></ul>\n<ul><li><b>must</b></li><li>Phải (bắt buộc), chắc chắn</li><li>You <b>must</b> wear a helmet. / She <b>must</b> be tired.</li></ul>\n<ul><li><b>mustn't</b></li><li>Cấm, không được</li><li>You <b>mustn't</b> smoke here.</li></ul>\n<ul><li><b>should</b></li><li>Nên (lời khuyên)</li><li>You <b>should</b> see a doctor.</li></ul>\n<ul><li><b>may</b></li><li>Có thể (xin phép), khả năng</li><li><b>May</b> I come in? / It <b>may</b> rain.</li></ul>\n<ul><li><b>might</b></li><li>Có thể (khả năng thấp)</li><li>He <b>might</b> be late.</li></ul>\n<ul><li><b>have to</b></li><li>Phải (bắt buộc bên ngoài)</li><li>I <b>have to</b> work on Saturday.</li></ul>\n\n\n<h3>Phân biệt must vs have to vs should</h3>\n<p>\n<b>must:</b> bắt buộc (nội quy, luật) — You <b>must</b> stop at a red light.<br>\n<b>have to:</b> bắt buộc (hoàn cảnh bên ngoài) — I <b>have to</b> wake up early for work.<br>\n<b>should:</b> nên (lời khuyên, không bắt buộc) — You <b>should</b> drink more water.<br>\n<b>mustn't:</b> CẤM — You <b>mustn't</b> cheat in the exam.<br>\n<b>don't have to:</b> KHÔNG CẦN — You <b>don't have to</b> come if you don't want. (Bạn không cần phải đến.)\n</p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Sau modal verb luôn dùng động từ nguyên thể không to.</li><li>Must diễn tả bắt buộc mạnh; have to thường nhấn mạnh quy định bên ngoài.</li><li>Should dùng cho lời khuyên; may/might dùng cho khả năng.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	0
165b74f8-2224-4556-bf9a-8f3aadea49fd	43	Comparatives & Superlatives	So sánh hơn và So sánh nhất	\n<h3>Quy tắc tổng hợp</h3>\n\n<ul><li><strong>Loại</strong></li><li><strong>So sánh hơn</strong></li><li><strong>So sánh nhất</strong></li></ul>\n<ul><li>Tính từ ngắn (1 âm tiết)</li><li>adj + <b>-er</b> + than</li><li><b>the</b> + adj + <b>-est</b></li></ul>\n<ul><li>Tính từ kết thúc -e</li><li>adj + <b>-r</b> + than</li><li><b>the</b> + adj + <b>-st</b></li></ul>\n<ul><li>Tính từ kết thúc 1NÂ+1PÂ</li><li>nhân đôi PÂ + <b>-er</b></li><li>nhân đôi PÂ + <b>-est</b></li></ul>\n<ul><li>Tính từ dài (2+ âm tiết)</li><li><b>more</b> + adj + than</li><li><b>the most</b> + adj</li></ul>\n<ul><li>Bất quy tắc</li><li>good → better → best | bad → worse → worst | far → farther → farthest | much/many → more → most | little → less → least</li></ul>\n\n\n<h3>Ví dụ</h3>\n<p>Tokyo is <b>bigger than</b> Osaka. <i>(Tokyo lớn hơn Osaka.)</i></p>\n<p>This book is <b>more interesting than</b> that one. <i>(Cuốn sách này thú vị hơn cuốn kia.)</i></p>\n<p>Mount Everest is <b>the highest</b> mountain in the world. <i>(Everest là ngọn núi cao nhất TG.)</i></p>\n\n<h3>So sánh bằng: as...as</h3>\n<p><b>S + be + as + adj + as + O</b></p>\n<p>She is <b>as tall as</b> her brother. <i>(Cô ấy cao bằng anh trai.)</i></p>\n<p>He is <b>not as rich as</b> his father. <i>(Anh ấy không giàu bằng bố.)</i></p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Tính từ ngắn thường thêm -er/-est, tính từ dài dùng more/most.</li><li>So sánh hơn dùng than; so sánh nhất thường dùng the.</li><li>Một số tính từ bất quy tắc như good, bad, far cần học riêng.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	0
5153ff52-b78c-4eb3-8356-bfc30dfb6f14	38	Present Simple	Thì Hiện Tại Đơn	<h3>Định nghĩa</h3><p>Thì Hiện tại đơn (Present Simple) diễn tả một <strong>sự thật hiển nhiên</strong>, <strong>thói quen lặp đi lặp lại</strong>, hoặc một <strong>trạng thái cố định</strong> ở hiện tại. Đây là thì cơ bản và quan trọng nhất trong tiếng Anh.</p><h3>Cấu trúc chi tiết</h3><ul><li><strong>Dạng câu</strong></li><li><strong>Cấu trúc</strong></li><li><strong>Ví dụ</strong></li><li><strong>Khẳng định</strong></li><li>S + V(s/es)</li><li>She <strong>works</strong> at a bank.</li><li><strong>Phủ định</strong></li><li>S + do/does + not + V(nguyên thể)</li><li>She <strong>doesn't work</strong> at a bank.</li><li><strong>Nghi vấn</strong></li><li>Do/Does + S + V(nguyên thể)?</li><li><strong>Does</strong> she <strong>work</strong> at a bank?</li><li><strong>WH-question</strong></li><li>Wh- + do/does + S + V?</li><li><strong>Where does</strong> she <strong>work</strong>?</li></ul><h3>📏 Quy tắc thêm -s/-es cho ngôi thứ 3 số ít (he/she/it)</h3><ul><li><strong>Quy tắc</strong></li><li><strong>Ví dụ</strong></li><li>Hầu hết các động từ: thêm <strong>-s</strong></li><li>play → play<strong>s</strong>, read → read<strong>s</strong></li><li>Tận cùng -s, -ss, -sh, -ch, -x, -z, -o: thêm <strong>-es</strong></li><li>watch → watch<strong>es</strong>, go → go<strong>es</strong>, miss → miss<strong>es</strong></li><li>Tận cùng phụ âm + y: đổi y → <strong>-ies</strong></li><li>study → stud<strong>ies</strong>, carry → carr<strong>ies</strong></li><li>Tận cùng nguyên âm + y: thêm <strong>-s</strong></li><li>play → play<strong>s</strong>, enjoy → enjoy<strong>s</strong></li><li>Trường hợp đặc biệt: <strong>have → has</strong></li><li>She <strong>has</strong> a beautiful house.</li></ul><h3>Cách dùng chi tiết</h3><p><strong>1. Thói quen, hành động lặp đi lặp lại:</strong></p><p>I <strong>wake up</strong> at 6 AM every morning. <em>(Tôi thức dậy lúc 6 giờ sáng mỗi ngày.)</em></p><p>My mother <strong>cooks</strong> dinner every evening. <em>(Mẹ tôi nấu bữa tối mỗi buổi chiều.)</em></p><p>We <strong>don't eat</strong> meat on Fridays. <em>(Chúng tôi không ăn thịt vào thứ Sáu.)</em></p><p><strong>2. Sự thật hiển nhiên, chân lý, quy luật tự nhiên:</strong></p><p>The Earth <strong>revolves</strong> around the Sun. <em>(Trái Đất quay quanh Mặt Trời.)</em></p><p>Water <strong>freezes</strong> at 0°C. <em>(Nước đóng băng ở 0°C.)</em></p><p>Light <strong>travels</strong> faster than sound. <em>(Ánh sáng truyền nhanh hơn âm thanh.)</em></p><p><strong>3. Lịch trình, thời gian biểu cố định:</strong></p><p>The train <strong>departs</strong> at 7:30 AM. <em>(Tàu khởi hành lúc 7:30 sáng.)</em></p><p>The shop <strong>opens</strong> at 9 and <strong>closes</strong> at 6. <em>(Cửa hàng mở cửa lúc 9 và đóng cửa lúc 6.)</em></p><p><strong>4. Trạng thái, cảm xúc, suy nghĩ (stative verbs):</strong></p><p>She <strong>loves</strong> chocolate. <em>(Cô ấy yêu thích sô-cô-la.)</em></p><p>I <strong>believe</strong> you are right. <em>(Tôi tin rằng bạn đúng.)</em></p><p>He <strong>owns</strong> three cars. <em>(Anh ấy sở hữu ba chiếc xe.)</em></p><h3>Dấu hiệu nhận biết</h3><p><strong>Trạng từ tần suất:</strong> always, usually, often, sometimes, rarely, seldom, never, hardly ever</p><p><strong>Cụm từ chỉ thời gian:</strong> every day/week/month/year, once a week, twice a month, on Mondays, in the morning/afternoon/evening</p><h3>Lỗi sai thường gặp</h3><p>She <strong>don't</strong> like coffee. → She <strong>doesn't</strong> like coffee. <em>(Ngôi 3 số ít dùng doesn't)</em></p><p>He <strong>playes</strong> guitar. → He <strong>plays</strong> guitar. <em>(play tận cùng nguyên âm+y → chỉ thêm s)</em></p><p><strong>Does</strong> she <strong>works</strong>? → <strong>Does</strong> she <strong>work</strong>? <em>(Sau does, V trở về nguyên thể)</em></p><p>I <strong>am go</strong> to school. → I <strong>go</strong> to school. <em>(HTĐ không dùng to be + V thường)</em></p><h3>Mẹo ghi nhớ</h3><p>Quy tắc vàng: Khi câu có <strong>does/doesn't</strong>, động từ chính LUÔN ở <strong>nguyên thể</strong> (không thêm -s/-es).</p><p>Nhớ: <strong>"Does ăn hết chữ S"</strong> → Does she works? → Does she work?</p><h3>Ôn nhanh trước khi làm bài</h3><ul><li>Dùng cho thói quen, sự thật hiển nhiên, lịch trình cố định và động từ trạng thái.</li><li>Nhớ thêm s/es với he, she, it trong câu khẳng định.</li><li>Sau do, does, don't, doesn't, động từ chính luôn về nguyên thể.</li></ul><p><strong>Cách tự kiểm tra:</strong> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>	0
72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	39	Second Conditional	Câu điều kiện loại 2	\n<h3>Định nghĩa</h3>\n<p>Câu điều kiện loại 2 diễn tả <b>điều kiện không có thật ở hiện tại</b> — tưởng tượng, ước muốn, giả định trái với thực tế.</p>\n\n<h3>Cấu trúc</h3>\n\n<ul><li><strong>Cấu trúc</strong></li><li><strong>If + S + V2/ed (quá khứ đơn), S + would + V</strong></li></ul>\n\n<p><b>Lưu ý đặc biệt:</b> Trong CĐK loại 2, to be → <b>were</b> cho TẤT CẢ các ngôi (kể cả I, he, she, it).</p>\n\n<h3>Ví dụ</h3>\n<p>If I <b>were</b> rich, I <b>would travel</b> around the world. <i>(Nếu tôi giàu, tôi sẽ đi du lịch vòng quanh TG.) → Thực tế: Tôi KHÔNG giàu.</i></p>\n<p>If I <b>had</b> wings, I <b>would fly</b>. <i>(Nếu tôi có cánh, tôi sẽ bay.) → Thực tế: Tôi KHÔNG có cánh.</i></p>\n<p>If she <b>spoke</b> English, she <b>would get</b> a better job. <i>(Nếu cô ấy nói được tiếng Anh, cô ấy sẽ có công việc tốt hơn.) → Thực tế: Cô ấy KHÔNG nói được tiếng Anh.</i></p>\n\n<h3>Ứng dụng: Cho lời khuyên</h3>\n<p>\nIf I <b>were</b> you, I <b>would study</b> harder. <i>(Nếu tôi là bạn, tôi sẽ học chăm hơn.)</i><br>\n→ Cách nói cho lời khuyên rất phổ biến: <b>"If I were you, I would..."</b>\n</p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Dùng cho tình huống giả định, ít có thật ở hiện tại hoặc tương lai.</li><li>Cấu trúc chính: If + past simple, would + V.</li><li>Với động từ be, were thường dùng cho mọi chủ ngữ trong văn phong chuẩn.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	1
8242916c-9535-4e55-893c-7d1338de5ea1	41	Reported Speech	Câu tường thuật (câu gián tiếp)	\n<h3>Định nghĩa</h3>\n<p>Câu tường thuật (Reported Speech / Indirect Speech) dùng để <b>thuật lại lời nói của người khác</b>, không trích dẫn nguyên văn.</p>\n\n<h3>Bảng lùi thì</h3>\n\n<ul><li><strong>Trực tiếp</strong></li><li><strong>Gián tiếp</strong></li></ul>\n<ul><li>am/is → <b>was</b></li><li>are → <b>were</b></li></ul>\n<ul><li>V1/V(s/es) → <b>V2/ed</b></li><li>am/is/are + V-ing → <b>was/were + V-ing</b></li></ul>\n<ul><li>have/has + V3 → <b>had + V3</b></li><li>V2/ed → <b>had + V3</b></li></ul>\n<ul><li>will → <b>would</b></li><li>can → <b>could</b></li></ul>\n<ul><li>may → <b>might</b></li><li>must → <b>had to</b></li></ul>\n<ul><li>shall → <b>should</b></li><li></li></ul>\n\n\n<h3>Đổi trạng từ</h3>\n\n<ul><li><strong>Trực tiếp</strong></li><li><strong>Gián tiếp</strong></li></ul>\n<ul><li>today → <b>that day</b></li><li>tomorrow → <b>the next day / the following day</b></li></ul>\n<ul><li>yesterday → <b>the day before / the previous day</b></li><li>now → <b>then / at that time</b></li></ul>\n<ul><li>here → <b>there</b></li><li>this → <b>that</b></li></ul>\n<ul><li>these → <b>those</b></li><li>ago → <b>before</b></li></ul>\n\n\n<h3>Ví dụ</h3>\n<p><b>Câu trần thuật:</b> "I am tired." → He said (that) he <b>was</b> tired.</p>\n<p><b>Câu hỏi Yes/No:</b> "Do you like coffee?" → She asked me <b>if/whether</b> I <b>liked</b> coffee.</p>\n<p><b>Câu hỏi Wh:</b> "Where do you live?" → He asked me <b>where</b> I <b>lived</b>.</p>\n<p><b>Câu mệnh lệnh:</b> "Open the door." → She told me <b>to open</b> the door.</p>\n<p><b>Câu phủ định mệnh lệnh:</b> "Don't touch that." → He told me <b>not to touch</b> that.</p>\n\n<h3>Lưu ý quan trọng</h3>\n<p>\nCâu hỏi gián tiếp dùng <b>trật tự câu trần thuật</b> (S + V), KHÔNG đảo ngữ.<br>\nHe asked where <b>did I live</b>. → He asked where <b>I lived</b>.\n</p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Đổi lùi thì khi động từ tường thuật ở quá khứ.</li><li>Đổi đại từ, trạng từ thời gian và nơi chốn theo ngữ cảnh.</li><li>Câu hỏi gián tiếp dùng trật tự câu kể, không đảo trợ động từ.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	0
a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	40	Passive Voice	Câu bị động toàn diện	<h3>Khi nào dùng câu bị động?</h3><ul><li>Khi <strong>không biết</strong> hoặc <strong>không cần biết</strong> ai thực hiện hành động</li><li>Khi muốn <strong>nhấn mạnh đối tượng bị tác động</strong>, không phải người thực hiện</li><li>Trong văn bản <strong>khoa học, báo chí, thông báo chính thức</strong></li></ul><h3>Công thức tổng quát</h3><p><strong>S (tân ngữ cũ) + BE (chia theo thì) + V3/ed + (by + tác nhân)</strong></p><h3>Bảng chuyển đổi theo từng thì</h3><ul><li><strong>Thì</strong></li><li><strong>Chủ động</strong></li><li><strong>Bị động</strong></li><li>HTĐ</li><li>She <strong>writes</strong> a letter.</li><li>A letter <strong>is written</strong> (by her).</li><li>HTTD</li><li>She <strong>is writing</strong> a letter.</li><li>A letter <strong>is being written</strong>.</li><li>HTHT</li><li>She <strong>has written</strong> a letter.</li><li>A letter <strong>has been written</strong>.</li><li>QKĐ</li><li>She <strong>wrote</strong> a letter.</li><li>A letter <strong>was written</strong>.</li><li>QKTD</li><li>She <strong>was writing</strong> a letter.</li><li>A letter <strong>was being written</strong>.</li><li>TLĐ</li><li>She <strong>will write</strong> a letter.</li><li>A letter <strong>will be written</strong>.</li><li>Modal</li><li>She <strong>can write</strong> a letter.</li><li>A letter <strong>can be written</strong>.</li></ul><h3>Thêm ví dụ thực tế</h3><p>English <strong>is spoken</strong> in many countries. <em>(Tiếng Anh được nói ở nhiều nước.)</em></p><p>The Mona Lisa <strong>was painted</strong> by Leonardo da Vinci. <em>(Bức Mona Lisa được vẽ bởi Leonardo da Vinci.)</em></p><p>The new bridge <strong>is being built</strong> now. <em>(Cây cầu mới đang được xây dựng.)</em></p><p>All the tickets <strong>have been sold</strong>. <em>(Tất cả vé đã được bán hết.)</em></p><p>Homework <strong>must be done</strong> before class. <em>(Bài tập phải được hoàn thành trước giờ học.)</em></p><h3>Lỗi sai thường gặp</h3><p>The cake <strong>was make</strong> by my mom. → The cake <strong>was made</strong>. <em>(Phải dùng V3: make → made)</em></p><p>English <strong>is speak</strong> worldwide. → English <strong>is spoken</strong>. <em>(speak → spoken)</em></p><p>The house <strong>is build</strong>. → The house <strong>is being built</strong> / <strong>was built</strong>. <em>(build → built)</em></p><h3>Ôn nhanh trước khi làm bài</h3><ul><li>Dùng bị động khi muốn nhấn mạnh người/vật chịu tác động hơn người thực hiện.</li><li>Cấu trúc chung là be + V3, trong đó be đổi theo thì.</li><li>Chỉ thêm by + agent khi người thực hiện thật sự cần thiết.</li></ul><p><strong>Cách tự kiểm tra:</strong> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>	0
f826100c-a5d5-4963-8f8e-8023cb2024f8	44	Relative Clauses	Mệnh đề quan hệ: who, which, that, whose, where, when	\n<h3>Bảng tổng hợp đại từ quan hệ</h3>\n\n<ul><li><strong>Đại từ</strong></li><li><strong>Thay cho</strong></li><li><strong>Chức năng</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li><b>who</b></li><li>Người</li><li>Chủ ngữ / Tân ngữ</li><li>The man <b>who</b> called you is my boss.</li></ul>\n<ul><li><b>whom</b></li><li>Người</li><li>Tân ngữ (trang trọng)</li><li>The girl <b>whom</b> I met was kind.</li></ul>\n<ul><li><b>which</b></li><li>Vật / Sự việc</li><li>Chủ ngữ / Tân ngữ</li><li>The book <b>which</b> I bought is great.</li></ul>\n<ul><li><b>that</b></li><li>Người / Vật</li><li>Chủ ngữ / Tân ngữ</li><li>The car <b>that</b> he drives is red.</li></ul>\n<ul><li><b>whose</b></li><li>Sở hữu</li><li>Thay cho his/her/its/their</li><li>The boy <b>whose</b> father is a doctor.</li></ul>\n<ul><li><b>where</b></li><li>Nơi chốn</li><li>= in/at which</li><li>The city <b>where</b> I was born.</li></ul>\n<ul><li><b>when</b></li><li>Thời gian</li><li>= in/at/on which</li><li>The day <b>when</b> we first met.</li></ul>\n\n\n<h3>Hai loại mệnh đề quan hệ</h3>\n<p><b>1. Xác định (Defining):</b> Cung cấp thông tin THIẾT YẾU, không có dấu phẩy.</p>\n<p>The student <b>who studies hard</b> will pass. <i>(Sinh viên nào học chăm sẽ đỗ.)</i></p>\n\n<p><b>2. Không xác định (Non-defining):</b> Thêm thông tin PHỤ, có dấu phẩy. KHÔNG dùng "that".</p>\n<p>My mother<b>, who is 60,</b> still works every day. <i>(Mẹ tôi, người 60 tuổi, vẫn làm việc mỗi ngày.)</i></p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Who dùng cho người, which dùng cho vật, whose dùng cho sở hữu.</li><li>That có thể thay who/which trong nhiều mệnh đề xác định.</li><li>Không bỏ đại từ quan hệ nếu nó là chủ ngữ của mệnh đề quan hệ.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	0
4f518c44-9b4d-42a4-bade-5b9350334d0f	47	Gerunds & Infinitives	V-ing vs To + V: quy tắc và danh sách động từ	\n<h3>Động từ theo sau bởi V-ing (Gerund)</h3>\n<p>\n<b>enjoy, avoid, finish, mind, suggest, keep, practice, consider, imagine, deny, risk, miss, delay, quit, admit, recall, resist, tolerate, involve, postpone</b>\n</p>\n<p>I <b>enjoy reading</b> books. | She <b>avoids eating</b> junk food. | He <b>finished writing</b> his essay.</p>\n\n<h3>Động từ theo sau bởi To + V (Infinitive)</h3>\n<p>\n<b>want, need, decide, hope, expect, plan, agree, refuse, promise, learn, offer, pretend, seem, appear, manage, afford, deserve, fail, tend, wish</b>\n</p>\n<p>She <b>decided to study</b> abroad. | I <b>want to learn</b> English. | They <b>agreed to help</b>.</p>\n\n<h3>Động từ dùng được CẢ HAI (nghĩa KHÁC nhau)</h3>\n\n<ul><li><strong>Động từ</strong></li><li><strong>+ V-ing</strong></li><li><strong>+ To V</strong></li></ul>\n<ul><li><b>remember</b></li><li>Nhớ ĐÃ LÀM: I remember <b>locking</b> the door.</li><li>Nhớ PHẢI LÀM: Remember <b>to lock</b> the door.</li></ul>\n<ul><li><b>forget</b></li><li>Quên ĐÃ LÀM: I'll never forget <b>meeting</b> her.</li><li>Quên PHẢI LÀM: Don't forget <b>to call</b> me.</li></ul>\n<ul><li><b>stop</b></li><li>Dừng làm gì: He stopped <b>smoking</b>.</li><li>Dừng lại để làm gì: He stopped <b>to smoke</b>.</li></ul>\n<ul><li><b>try</b></li><li>Thử làm: Try <b>adding</b> more salt.</li><li>Cố gắng: Try <b>to finish</b> it.</li></ul>\n\n\n<h3>Sau giới từ: LUÔN dùng V-ing</h3>\n<p>I'm interested <b>in learning</b>. | She's good <b>at cooking</b>. | Thank you <b>for helping</b>.</p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Một số động từ theo sau bởi V-ing, một số theo sau bởi to + V.</li><li>Sau giới từ luôn dùng V-ing.</li><li>Một số động từ đổi nghĩa khi đi với V-ing hoặc to + V, như remember, stop, try.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	0
fbbe5a1b-05da-4dfc-adf6-54d1234f026e	48	Question Tags	Câu hỏi đuôi: quy tắc và trường hợp đặc biệt	\n<h3>Quy tắc chính</h3>\n<p>\nCâu <b>khẳng định</b> → đuôi <b>phủ định</b><br>\nCâu <b>phủ định</b> → đuôi <b>khẳng định</b>\n</p>\n\n<h3>Ví dụ theo từng dạng</h3>\n\n<ul><li><strong>Câu chính</strong></li><li><strong>Đuôi</strong></li></ul>\n<ul><li>She <b>is</b> a student,</li><li><b>isn't she</b>?</li></ul>\n<ul><li>They <b>can't</b> swim,</li><li><b>can they</b>?</li></ul>\n<ul><li>You <b>live</b> here,</li><li><b>don't you</b>?</li></ul>\n<ul><li>He <b>didn't</b> call,</li><li><b>did he</b>?</li></ul>\n<ul><li>She <b>has finished</b>,</li><li><b>hasn't she</b>?</li></ul>\n<ul><li>You <b>won't</b> forget,</li><li><b>will you</b>?</li></ul>\n\n\n<h3>Trường hợp đặc biệt</h3>\n<p>• <b>I am</b> right, <b>aren't I</b>? (KHÔNG dùng "amn't I")</p>\n<p>• <b>Let's</b> go, <b>shall we</b>?</p>\n<p>• <b>Don't</b> touch that, <b>will you</b>?</p>\n<p>• <b>Nobody</b> came, <b>did they</b>? (nobody = phủ định → đuôi khẳng định)</p>\n<p>• <b>Everyone</b> is here, <b>aren't they</b>? (everyone → đại từ "they")</p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Mệnh đề chính khẳng định thì đuôi phủ định, và ngược lại.</li><li>Dùng cùng trợ động từ/thì với mệnh đề chính.</li><li>Các trường hợp đặc biệt như I am -> aren't I, let's -> shall we cần ghi nhớ.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	0
1a03369b-236d-4c49-b873-04d19962f01a	49	Subject-Verb Agreement	Sự hòa hợp giữa chủ ngữ và động từ	\n<h3>Quy tắc tổng hợp</h3>\n\n<ul><li><strong>Chủ ngữ</strong></li><li><strong>Động từ</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li>Everyone, someone, nobody, each, every</li><li><b>Số ít</b></li><li>Everyone <b>is</b> here.</li></ul>\n<ul><li>Both, many, few, several</li><li><b>Số nhiều</b></li><li>Both <b>are</b> correct.</li></ul>\n<ul><li>The news, mathematics, physics</li><li><b>Số ít</b></li><li>The news <b>is</b> good.</li></ul>\n<ul><li>Either A or B / Neither A nor B</li><li><b>Theo B (gần nhất)</b></li><li>Neither he nor they <b>are</b> coming.</li></ul>\n<ul><li>A number of + N</li><li><b>Số nhiều</b></li><li>A number of students <b>are</b> absent.</li></ul>\n<ul><li>The number of + N</li><li><b>Số ít</b></li><li>The number of students <b>is</b> 50.</li></ul>\n\n\n<h3>Ví dụ thêm</h3>\n<p>Each student <b>has</b> a textbook. <i>(Mỗi sinh viên có một cuốn sách.)</i></p>\n<p>Neither the teacher nor the students <b>were</b> happy. <i>(Chia theo SN gần nhất: students → số nhiều)</i></p>\n<p>The United States <b>is</b> a big country. <i>(Tên nước → số ít dù có -s)</i></p>\n<section data-grammar-enhancement="quick-review">\n<h3>Ôn nhanh trước khi làm bài</h3>\n<ul><li>Động từ phải hòa hợp với chủ ngữ thật, không phải từ đứng gần nhất.</li><li>Each, every, everyone thường đi với động từ số ít.</li><li>Một số danh từ tập hợp hoặc cụm nối bằng and/or cần xét nghĩa và vị trí.</li></ul>\n<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>\n</section>	0
\.


--
-- Data for Name: learninglevels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.learninglevels (id, code, name, description) FROM stdin;
1	BEGINNER	Người mới học	Chưa biết hoặc biết rất ít
2	INTERMEDIATE	Cơ bản	Đã biết chút ít
3	ADVANCED	Nâng cao	Đã học lâu, sử dụng tốt
\.


--
-- Data for Name: listeninglessons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listeninglessons (id, title, description, level, topic, objective, duration, passagetitle, audiourl, orderindex, createdat, updatedat, isfoundation) FROM stdin;
3c3af2dc-5680-4906-a850-58560747cb9f	Màu sắc và đồ vật quen thuộc	Nghe câu ngắn về màu sắc và đồ vật trong lớp học.	A1	Colors and objects	Nhận diện màu sắc và đồ vật qua câu ngắn.	8 phút	\N	\N	-49	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:58.773+07	t
eb79a03f-9018-410a-937a-6932047adb7d	Thời gian trong ngày	Luyện nghe giờ đơn giản và hoạt động trong ngày.	A1	Time	Nghe giờ và hoạt động thường ngày.	9 phút	\N	\N	-48	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:58.824+07	t
b01c88a4-3ad5-4f98-999b-553830aaf7e6	Chào hỏi và giới thiệu tên	Nghe các câu chào hỏi rất ngắn cho người mới bắt đầu.	A0	Greetings	Nghe các câu chào hỏi rất ngắn cho người mới bắt đầu.	5 phút	Chào hỏi và giới thiệu tên		-47	2026-06-12 09:39:58.830245+07	2026-06-12 09:40:11.58723+07	t
04ed6a9c-8a8d-4263-b462-b21554d286fe	Số và thông tin cá nhân	Nghe số tuổi, số điện thoại đơn giản và câu hỏi thông tin cá nhân.	A0	Personal information	Nghe số tuổi, số điện thoại đơn giản và câu hỏi thông tin cá nhân.	5 phút	Số và thông tin cá nhân		-46	2026-06-12 09:39:59.038052+07	2026-06-12 09:40:11.611951+07	t
bd620079-7933-41f4-a825-bbae50ab23c7	A Morning Routine	Nghe hội thoại ngắn về thói quen buổi sáng.	A1	Daily life	Nhận biết thời gian, hoạt động hằng ngày và ý chính của cuộc hội thoại.	8 phút		\N	1	2026-05-22 09:40:06.84333+07	2026-05-22 09:40:06.84333+07	f
20abb717-63e6-45d5-a22e-96636beedb50	Checking In At A Hotel	Nghe tình huống nhận phòng khách sạn.	A2	Travel	Bắt thông tin về đặt phòng, giấy tờ và thời gian trả phòng.	10 phút		\N	2	2026-05-22 09:40:06.990171+07	2026-05-22 09:40:06.990171+07	f
949f3df4-f7a3-4697-8005-22d7b9deaa73	Ordering Lunch	Listen to a short conversation at a lunch counter.	A1	Food	Understand simple food orders and prices.	10 phút	\N	\N	3	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:58.877+07	f
073560d6-69c3-4c98-9c63-cf724896c2b2	At The Bus Stop	Listen for route, time, and destination details.	A1	Transport	Catch simple travel information in a short dialogue.	11 phút	\N	\N	4	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:58.927+07	f
5f7512ec-0338-407b-973b-e383a6a91503	Making An Appointment	Understand a simple phone call about choosing a time.	A2	Appointments	Listen for day, time, and purpose.	12 phút	\N	\N	5	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:58.98+07	f
6267aa83-f1b9-49ce-bdd3-f3df12db2568	Nghe chữ cái và đánh vần	Luyện nghe bảng chữ cái, cách đánh vần tên và từ ngắn.	A1	Alphabet	Nghe và nhận diện chữ cái tiếng Anh.	8 phút			-50	2026-06-18 14:30:58.633595+07	2026-06-27 23:36:18.194143+07	t
\.


--
-- Data for Name: listeningprogress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listeningprogress (userid, lessonid, status, score, updatedat) FROM stdin;
00000000-0000-4000-8000-000000000101	3c3af2dc-5680-4906-a850-58560747cb9f	in_progress	65	2026-07-01 20:00:00+07
00000000-0000-4000-8000-000000000102	3c3af2dc-5680-4906-a850-58560747cb9f	completed	86	2026-07-01 20:05:00+07
00000000-0000-4000-8000-000000000102	eb79a03f-9018-410a-937a-6932047adb7d	in_progress	70	2026-07-01 20:10:00+07
00000000-0000-4000-8000-000000000103	3c3af2dc-5680-4906-a850-58560747cb9f	completed	95	2026-07-01 20:15:00+07
00000000-0000-4000-8000-000000000103	eb79a03f-9018-410a-937a-6932047adb7d	completed	90	2026-07-01 20:20:00+07
\.


--
-- Data for Name: listeningquestions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listeningquestions (id, lessonid, questiontype, prompt, optiona, optionb, optionc, optiond, correctanswer, correctboolean, acceptedanswers, explanation, orderindex) FROM stdin;
4d4d168b-58fb-4681-bd76-f320268af0ff	bd620079-7933-41f4-a825-bbae50ab23c7	multiple_choice	What is the conversation mainly about?	Weekend plans	Morning routines	A bus ticket	A school test	Morning routines	\N		Anna and Ben talk about waking up, breakfast, and going out in the morning.	0
ad0ebb3c-8467-4c13-a904-39c530f04a90	bd620079-7933-41f4-a825-bbae50ab23c7	true_false	Ben catches the bus at seven fifteen.						t		Ben says he catches the bus at seven fifteen.	1
1d7c3f57-2f8d-40fc-b383-8cbb2e9171b3	bd620079-7933-41f4-a825-bbae50ab23c7	fill_blank	Anna drinks coffee and reads the ____.					news	\N	news\nthe news	The missing word is "news".	2
86baa134-eabd-486b-b509-322fd170a7e2	20abb717-63e6-45d5-a22e-96636beedb50	multiple_choice	How long will the guest stay?	One night	Two nights	Three nights	One week	Two nights	\N		The receptionist confirms one single room for two nights.	0
b2e530d1-747c-4ebb-bd33-584d1825f89b	20abb717-63e6-45d5-a22e-96636beedb50	true_false	Breakfast starts at six thirty.						t		The receptionist says breakfast is from six thirty to nine.	1
7710a244-601a-41c9-ab72-e7e66d3945f2	20abb717-63e6-45d5-a22e-96636beedb50	fill_blank	Check-out is at ____ in the morning.					eleven	\N	eleven\n11\n11:00	Check-out is at eleven in the morning.	2
94c5b348-a5c4-4f21-b2e0-1a2174f88228	b01c88a4-3ad5-4f98-999b-553830aaf7e6	multiple_choice	What is the woman’s name?	Anna	Ben	Mai	Tom	Anna	f			1
48a615ff-0a77-42ec-87ca-8b012fba93b0	b01c88a4-3ad5-4f98-999b-553830aaf7e6	true_false	Ben says: I am Ben.						t			2
127ff7bd-1882-4cca-806e-454578e30de0	b01c88a4-3ad5-4f98-999b-553830aaf7e6	fill_blank	Nice to ____ you.					meet	f	meet		3
4f8d07a3-36b3-4854-8d0a-30a9a3f1e044	04ed6a9c-8a8d-4263-b462-b21554d286fe	multiple_choice	How old is Tom?	Eight	Eighteen	Twenty	Ten	Eighteen	f			1
c1a41996-5b8b-4f92-a5c5-a1a730209836	04ed6a9c-8a8d-4263-b462-b21554d286fe	true_false	Tom’s number starts with one.						t			2
040650dd-d65b-410f-ac99-acc3c8044481	04ed6a9c-8a8d-4263-b462-b21554d286fe	fill_blank	What is your phone ____?					number	f	number		3
8942d3ef-814b-4508-9287-f5192e90ff95	6267aa83-f1b9-49ce-bdd3-f3df12db2568	multiple_choice	What does the teacher ask the student to do?	Repeat the letters	Open a book	Write an email	Buy a pen	Repeat the letters	\N	\N	The teacher says: Listen and repeat the letters.	1
73b31635-291b-4f99-a0c0-90fc5b0828d2	6267aa83-f1b9-49ce-bdd3-f3df12db2568	multiple_choice	How does the student spell Linh?	L-I-N-H	L-A-N-H	L-I-M-H	L-E-N-H	L-I-N-H	\N	\N		2
d36d2bc5-f500-4647-8ad7-23b69eb29478	6267aa83-f1b9-49ce-bdd3-f3df12db2568	fill_blank	Complete the word: sp___	\N	\N	\N	\N	spell	\N	spell	The lesson practices spelling names.	3
f6954457-5ee7-4d99-acb7-41e0a2d7c7e0	3c3af2dc-5680-4906-a850-58560747cb9f	multiple_choice	What color is the pen?	Blue	Red	Green	Yellow	Blue	\N	\N		1
f396d093-48f6-490d-af68-2a8d8ac92696	3c3af2dc-5680-4906-a850-58560747cb9f	multiple_choice	What object is red?	Notebook	Pen	Desk	Bag	Notebook	\N	\N		2
69b24c58-93ef-49a0-9657-5cbc65f1fa6e	3c3af2dc-5680-4906-a850-58560747cb9f	true_false	The notebook is blue.	\N	\N	\N	\N	\N	f	\N	The notebook is red.	3
5680558f-8161-4372-ae05-80a6491771b8	eb79a03f-9018-410a-937a-6932047adb7d	multiple_choice	What time does Anna get up?	Six thirty	Seven fifteen	Seven o clock	Ten	Six thirty	\N	\N		1
c82617e3-f23f-4510-957f-c29fc195c92b	eb79a03f-9018-410a-937a-6932047adb7d	multiple_choice	What does Mark do at seven o clock?	He has dinner	He goes to school	He gets up	He studies English	He has dinner	\N	\N		2
8005ce32-9f33-48ca-b0fc-f41c750824df	eb79a03f-9018-410a-937a-6932047adb7d	fill_blank	Anna goes to school at seven ___.	\N	\N	\N	\N	fifteen	\N	fifteen\n7:15	The audio says seven fifteen.	3
f505cc4b-56b9-4b4f-a769-2ba85fcbdf3a	949f3df4-f7a3-4697-8005-22d7b9deaa73	multiple_choice	What does the customer order?	A chicken sandwich and orange juice	A salad and tea	A burger and water	Soup and coffee	A chicken sandwich and orange juice	\N	\N		1
3fbdb077-4a2b-4aaf-873c-ddb8ae17c697	949f3df4-f7a3-4697-8005-22d7b9deaa73	multiple_choice	How much is the lunch?	Six dollars	Five dollars	Seven dollars	Ten dollars	Six dollars	\N	\N		2
01094196-bd4e-4be1-8f90-e86abce42448	949f3df4-f7a3-4697-8005-22d7b9deaa73	true_false	The customer orders coffee.	\N	\N	\N	\N	\N	f	\N	The customer orders orange juice.	3
6c355006-31c5-47d7-8acc-12582a320ca9	073560d6-69c3-4c98-9c63-cf724896c2b2	multiple_choice	Where does the traveler want to go?	The museum	The airport	The library	The hotel	The museum	\N	\N		1
e89424cb-9a8e-4909-a69a-43a59d345989	073560d6-69c3-4c98-9c63-cf724896c2b2	multiple_choice	Which bus should the traveler take?	Number twelve	Number twenty	Number two	Number ten	Number twelve	\N	\N		2
eb717903-c584-4552-828a-0b79c2e21177	073560d6-69c3-4c98-9c63-cf724896c2b2	fill_blank	The bus arrives in ___ minutes.	\N	\N	\N	\N	ten	\N	ten\n10		3
625856f7-864f-4957-93b2-eb5bb137f8f9	5f7512ec-0338-407b-973b-e383a6a91503	multiple_choice	Who does the caller want to meet?	Dr. Brown	A teacher	A manager	A driver	Dr. Brown	\N	\N		1
152799e3-c89a-46fc-951c-f0be24659891	5f7512ec-0338-407b-973b-e383a6a91503	multiple_choice	When is the appointment?	Thursday at three	Tuesday at three	Thursday at two	Friday at ten	Thursday at three	\N	\N		2
d28a7806-ae07-4178-baf5-1202c44c7274	5f7512ec-0338-407b-973b-e383a6a91503	true_false	The call is about buying medicine.	\N	\N	\N	\N	\N	f	\N	The call is about making an appointment.	3
\.


--
-- Data for Name: listeningsegments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listeningsegments (id, lessonid, speaker, text, orderindex, speakerid) FROM stdin;
dd04e0cd-d4c2-4f8f-a43a-39e67f6581b1	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Alex	Listen and repeat the letters: A, B, C, D, E.	1	a48a0184-1989-4327-8f36-c69673ab8de3
4af6da85-c47e-4c49-a07f-087b1ad0c082	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Emma	A, B, C, D, E.	2	d500acda-ad30-4bb8-b1f6-6594ce7a14d9
83cdc1a9-808e-4b3e-91bd-5308adfddb99	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Alex	How do you spell your name?	3	a48a0184-1989-4327-8f36-c69673ab8de3
8870790f-5d8e-4850-9dd2-b8544cda7b61	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Emma	L-I-N-H. Linh.	4	d500acda-ad30-4bb8-b1f6-6594ce7a14d9
5b184c60-3e5c-44b8-8258-773f9728ddcf	3c3af2dc-5680-4906-a850-58560747cb9f	Alex	This is a blue pen.	1	14631482-12af-47e7-acbb-d02145416b05
866021ca-0998-4b61-bad5-b9357b023ae7	3c3af2dc-5680-4906-a850-58560747cb9f	Emma	The pen is blue.	2	0c789cab-c2e5-45b5-997d-dff9a418d28b
c0b91413-6531-4b1f-942b-4c6eb26bcc8d	3c3af2dc-5680-4906-a850-58560747cb9f	Alex	That is a red notebook.	3	14631482-12af-47e7-acbb-d02145416b05
daa5bf97-5c24-4d70-9776-b1dcef2f4de4	3c3af2dc-5680-4906-a850-58560747cb9f	Emma	The notebook is red.	4	0c789cab-c2e5-45b5-997d-dff9a418d28b
060fbb71-74e3-4935-aeb8-991954e7a099	eb79a03f-9018-410a-937a-6932047adb7d	Alex	I get up at six thirty.	1	16071faf-02f8-47db-9fa2-1ce7d5388f3d
c0a95333-0864-4cb6-86de-4f7bb6aa7cea	eb79a03f-9018-410a-937a-6932047adb7d	Emma	I go to school at seven fifteen.	2	75704a2f-c472-42f2-9624-f309d9a07b8d
1f533562-1c62-444e-85b5-adea359d59d6	eb79a03f-9018-410a-937a-6932047adb7d	Alex	I have dinner at seven o clock.	3	16071faf-02f8-47db-9fa2-1ce7d5388f3d
cbdd6734-e63b-47d6-89ba-ad0f8ad92606	eb79a03f-9018-410a-937a-6932047adb7d	Emma	I go to bed at ten.	4	75704a2f-c472-42f2-9624-f309d9a07b8d
f3c10ed7-d6e7-4b9e-950d-6126ef270755	b01c88a4-3ad5-4f98-999b-553830aaf7e6	Alex	Hello. My name is Anna.	1	e1afafac-c870-4f70-a260-465ce60fcb3f
183520fe-29a7-4f4f-b841-b1ef42ffe05b	b01c88a4-3ad5-4f98-999b-553830aaf7e6	Emma	Hi Anna. I am Ben.	2	114303bd-ac71-4b2c-a71c-98110360bf0b
46d07099-c9f2-430a-bfb0-f14cadc42524	b01c88a4-3ad5-4f98-999b-553830aaf7e6	Alex	Nice to meet you, Ben.	3	e1afafac-c870-4f70-a260-465ce60fcb3f
06b8d51c-5595-4788-b71f-6b5113024131	b01c88a4-3ad5-4f98-999b-553830aaf7e6	Emma	Nice to meet you too.	4	114303bd-ac71-4b2c-a71c-98110360bf0b
cb58cbcb-7f43-4ae1-a6bf-d0810dc87aa0	04ed6a9c-8a8d-4263-b462-b21554d286fe	Alex	How old are you?	1	81f75cdd-adbd-46ef-b59b-0a8dae24aa05
a8dfab80-1a65-4ce4-a13c-bbe468bea08a	04ed6a9c-8a8d-4263-b462-b21554d286fe	Emma	I am eighteen years old.	2	2d81b37c-f0fd-484c-80bb-e569e4f581aa
a3798c5c-c1b6-485e-9c54-71570ee31f78	04ed6a9c-8a8d-4263-b462-b21554d286fe	Alex	What is your phone number?	3	81f75cdd-adbd-46ef-b59b-0a8dae24aa05
b4cf7bd2-930f-4d63-8956-2150dc3aa0b8	04ed6a9c-8a8d-4263-b462-b21554d286fe	Emma	It is one two three four.	4	2d81b37c-f0fd-484c-80bb-e569e4f581aa
86739d41-73f5-4c15-bf9d-ea333473edba	bd620079-7933-41f4-a825-bbae50ab23c7	Alex	Hi Ben. What time do you wake up on weekdays?	0	1d6e8b8d-e23b-4e80-aaa6-b24d13481239
6537a85d-3058-42a2-a436-654a397b3f54	bd620079-7933-41f4-a825-bbae50ab23c7	Emma	I usually wake up at six thirty. I catch the bus at seven fifteen.	1	db1cf9ba-a6e6-4264-a867-67e95a6af17b
8b5c1cce-67ab-4dfe-a018-b6a79f3cc1de	bd620079-7933-41f4-a825-bbae50ab23c7	Alex	That is early. I wake up at seven and have breakfast at home.	2	1d6e8b8d-e23b-4e80-aaa6-b24d13481239
34f47f62-1e8a-4fa7-90ce-231cbde74c09	bd620079-7933-41f4-a825-bbae50ab23c7	Emma	What do you eat for breakfast?	3	db1cf9ba-a6e6-4264-a867-67e95a6af17b
5d4ae71b-f552-4f88-9518-94a1df1e2ee5	20abb717-63e6-45d5-a22e-96636beedb50	Emma	Great. What time is check-out?	5	0af21086-2b4c-4910-9f2b-da3507075fb5
ab1ef11b-428f-47b6-9492-5835c0b81108	bd620079-7933-41f4-a825-bbae50ab23c7	Alex	I eat bread, drink coffee, and read the news for ten minutes.	4	1d6e8b8d-e23b-4e80-aaa6-b24d13481239
f1ff03e7-10d5-4ec6-9207-84e896293ea7	bd620079-7933-41f4-a825-bbae50ab23c7	Emma	That sounds calm. My mornings are always busy.	5	db1cf9ba-a6e6-4264-a867-67e95a6af17b
e5651917-92fd-45b1-9b5d-188f6a773d1f	20abb717-63e6-45d5-a22e-96636beedb50	Alex	Good evening. Welcome to Green Lake Hotel. How can I help you?	0	cc3055e2-242c-4bcf-a3ad-d533db052df3
81917098-a9e1-403e-9fc0-b5dd2ea07310	20abb717-63e6-45d5-a22e-96636beedb50	Emma	Hello. I have a reservation under the name Nguyen.	1	0af21086-2b4c-4910-9f2b-da3507075fb5
2912a7c6-49ba-498f-a69f-e12f3700065d	20abb717-63e6-45d5-a22e-96636beedb50	Alex	Let me check. Yes, one single room for two nights.	2	cc3055e2-242c-4bcf-a3ad-d533db052df3
c3114cc2-f40f-4c12-901b-f814a860b3fe	20abb717-63e6-45d5-a22e-96636beedb50	Emma	That is right. Do you need my passport?	3	0af21086-2b4c-4910-9f2b-da3507075fb5
41c137d7-48d9-454b-9fa6-328d74370c7c	20abb717-63e6-45d5-a22e-96636beedb50	Alex	Yes, please. Here is your key card. Breakfast is from six thirty to nine.	4	cc3055e2-242c-4bcf-a3ad-d533db052df3
8f49814f-ce33-45b5-94f4-bcf067d539a5	20abb717-63e6-45d5-a22e-96636beedb50	Alex	Check-out is at eleven in the morning.	6	cc3055e2-242c-4bcf-a3ad-d533db052df3
6f3443e1-0f0c-4e3e-9901-a38d7e0c004c	949f3df4-f7a3-4697-8005-22d7b9deaa73	Alex	Hello. What would you like for lunch?	1	0e344a65-6d74-41b8-832d-6963dd836587
52eeb24a-286e-4a52-8700-084520ab4f98	949f3df4-f7a3-4697-8005-22d7b9deaa73	Emma	I would like a chicken sandwich and orange juice.	2	e7880692-a342-4d05-908b-5c4b4d1111b9
0d4fb804-3a2c-46e5-b78d-cf13f9113ee8	949f3df4-f7a3-4697-8005-22d7b9deaa73	Alex	Sure. That is six dollars.	3	0e344a65-6d74-41b8-832d-6963dd836587
ce78ec4c-148d-46ff-a50e-beb303d352b3	949f3df4-f7a3-4697-8005-22d7b9deaa73	Emma	Here you are. Thank you.	4	e7880692-a342-4d05-908b-5c4b4d1111b9
06b5963a-7fbd-45ad-8172-8bb09dbff26e	073560d6-69c3-4c98-9c63-cf724896c2b2	Alex	Excuse me, does this bus go to the museum?	1	2aea7d67-3eb9-4b04-af07-654ac03a4f27
da20ac6a-4b28-4a97-96cc-1fba13ba0a3d	073560d6-69c3-4c98-9c63-cf724896c2b2	Emma	Yes, take bus number twelve.	2	61b741fc-fc80-4047-b115-51692babc35f
9e685ef6-f886-4dc1-a154-15b277b01c25	073560d6-69c3-4c98-9c63-cf724896c2b2	Alex	When does it arrive?	3	2aea7d67-3eb9-4b04-af07-654ac03a4f27
e54020f6-a673-4349-8499-06fe1676b74d	073560d6-69c3-4c98-9c63-cf724896c2b2	Emma	It arrives in ten minutes.	4	61b741fc-fc80-4047-b115-51692babc35f
5279fb3a-42b8-4b70-ab3e-ff83c94a4102	5f7512ec-0338-407b-973b-e383a6a91503	Alex	Good morning. How can I help you?	1	25de0904-1921-4a34-975c-7624c76407bf
7c360a7f-7003-4888-be57-70f8039ada22	5f7512ec-0338-407b-973b-e383a6a91503	Emma	I need to make an appointment with Dr. Brown.	2	28eec00a-7a3e-40ff-aa11-c353550bce55
30a14cd8-93a4-41b3-8df2-dc32d69e5265	5f7512ec-0338-407b-973b-e383a6a91503	Alex	Is Thursday at three o clock okay?	3	25de0904-1921-4a34-975c-7624c76407bf
66e41aa7-1a04-497a-8101-833b3effe618	5f7512ec-0338-407b-973b-e383a6a91503	Emma	Yes, Thursday at three is fine.	4	28eec00a-7a3e-40ff-aa11-c353550bce55
\.


--
-- Data for Name: listeningspeakers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listeningspeakers (id, lessonid, name, gender, voicename, voiceuri, orderindex, createdat, updatedat) FROM stdin;
e58de633-6dec-4bd6-936e-3e4ac2ba4edc	20abb717-63e6-45d5-a22e-96636beedb50	Receptionist	female	\N	\N	0	2026-05-24 15:45:28.856426+07	2026-05-24 15:45:28.856426+07
8cd641ff-0b7e-4036-a2ef-3497657eace9	20abb717-63e6-45d5-a22e-96636beedb50	Guest	female	\N	\N	0	2026-05-24 15:45:28.856426+07	2026-05-24 15:45:28.856426+07
5ccef698-e87c-4ea2-a9ae-71fcdc8da774	bd620079-7933-41f4-a825-bbae50ab23c7	Ben	female			0	2026-05-24 15:45:28.856426+07	2026-05-24 15:49:43.586364+07
486c650c-f2a5-4818-9e2d-f6095648482b	bd620079-7933-41f4-a825-bbae50ab23c7	Anna	neutral			0	2026-05-24 15:45:28.856426+07	2026-05-24 15:50:50.708975+07
17279189-f681-4e59-8457-4e3f36f3e978	b01c88a4-3ad5-4f98-999b-553830aaf7e6	ben	male			0	2026-06-12 10:21:33.079971+07	2026-06-12 10:21:33.079971+07
e53a44a1-806c-48b7-8bf0-cbf280d388b8	b01c88a4-3ad5-4f98-999b-553830aaf7e6	anna	female	Microsoft Zira - English (United States)	Microsoft Zira - English (United States)	0	2026-06-12 10:21:24.148593+07	2026-06-12 10:22:58.212088+07
b661687a-39ab-47ff-a8c5-4f39a65f4a47	6267aa83-f1b9-49ce-bdd3-f3df12db2568	long	male			0	2026-06-18 22:50:08.059952+07	2026-06-18 22:50:08.059952+07
1ed2d6d8-d537-4e7d-a093-7b0b8d964a0f	6267aa83-f1b9-49ce-bdd3-f3df12db2568	linh	female			0	2026-06-25 08:20:38.325503+07	2026-06-25 08:20:38.325503+07
a48a0184-1989-4327-8f36-c69673ab8de3	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Alex	male	Microsoft David		1	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
d500acda-ad30-4bb8-b1f6-6594ce7a14d9	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Emma	female	Microsoft Zira		2	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
14631482-12af-47e7-acbb-d02145416b05	3c3af2dc-5680-4906-a850-58560747cb9f	Alex	male	Microsoft David		1	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
0c789cab-c2e5-45b5-997d-dff9a418d28b	3c3af2dc-5680-4906-a850-58560747cb9f	Emma	female	Microsoft Zira		2	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
16071faf-02f8-47db-9fa2-1ce7d5388f3d	eb79a03f-9018-410a-937a-6932047adb7d	Alex	male	Microsoft David		1	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
75704a2f-c472-42f2-9624-f309d9a07b8d	eb79a03f-9018-410a-937a-6932047adb7d	Emma	female	Microsoft Zira		2	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
e1afafac-c870-4f70-a260-465ce60fcb3f	b01c88a4-3ad5-4f98-999b-553830aaf7e6	Alex	male	Microsoft David		1	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
114303bd-ac71-4b2c-a71c-98110360bf0b	b01c88a4-3ad5-4f98-999b-553830aaf7e6	Emma	female	Microsoft Zira		2	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
81f75cdd-adbd-46ef-b59b-0a8dae24aa05	04ed6a9c-8a8d-4263-b462-b21554d286fe	Alex	male	Microsoft David		1	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
2d81b37c-f0fd-484c-80bb-e569e4f581aa	04ed6a9c-8a8d-4263-b462-b21554d286fe	Emma	female	Microsoft Zira		2	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
1d6e8b8d-e23b-4e80-aaa6-b24d13481239	bd620079-7933-41f4-a825-bbae50ab23c7	Alex	male	Microsoft David		1	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
db1cf9ba-a6e6-4264-a867-67e95a6af17b	bd620079-7933-41f4-a825-bbae50ab23c7	Emma	female	Microsoft Zira		2	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
cc3055e2-242c-4bcf-a3ad-d533db052df3	20abb717-63e6-45d5-a22e-96636beedb50	Alex	male	Microsoft David		1	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
0af21086-2b4c-4910-9f2b-da3507075fb5	20abb717-63e6-45d5-a22e-96636beedb50	Emma	female	Microsoft Zira		2	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
0e344a65-6d74-41b8-832d-6963dd836587	949f3df4-f7a3-4697-8005-22d7b9deaa73	Alex	male	Microsoft David		1	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
e7880692-a342-4d05-908b-5c4b4d1111b9	949f3df4-f7a3-4697-8005-22d7b9deaa73	Emma	female	Microsoft Zira		2	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
2aea7d67-3eb9-4b04-af07-654ac03a4f27	073560d6-69c3-4c98-9c63-cf724896c2b2	Alex	male	Microsoft David		1	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
61b741fc-fc80-4047-b115-51692babc35f	073560d6-69c3-4c98-9c63-cf724896c2b2	Emma	female	Microsoft Zira		2	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
25de0904-1921-4a34-975c-7624c76407bf	5f7512ec-0338-407b-973b-e383a6a91503	Alex	male	Microsoft David		1	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
28eec00a-7a3e-40ff-aa11-c353550bce55	5f7512ec-0338-407b-973b-e383a6a91503	Emma	female	Microsoft Zira		2	2026-06-25 17:02:55.465227+07	2026-06-25 17:02:55.465227+07
\.


--
-- Data for Name: listeningvocabulary; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listeningvocabulary (id, lessonid, word, meaning, orderindex) FROM stdin;
9f6d16c7-7fa9-4f43-9864-cdfd5a49fd77	bd620079-7933-41f4-a825-bbae50ab23c7	weekday	ngày trong tuần	0
8006d617-c29f-485b-adfa-f5ac08c2e998	bd620079-7933-41f4-a825-bbae50ab23c7	catch the bus	bắt xe buýt	1
39539bf4-16e7-48ba-9178-17cd67e4e1a5	bd620079-7933-41f4-a825-bbae50ab23c7	usually	thường xuyên	2
82549ae9-3e76-4f12-aea7-b857504e70f1	bd620079-7933-41f4-a825-bbae50ab23c7	news	tin tức	3
563dc10e-63e9-4274-895b-1dbf7206033c	20abb717-63e6-45d5-a22e-96636beedb50	reservation	đặt phòng	0
adea3144-453f-468a-88c5-cd60a4e23fc0	20abb717-63e6-45d5-a22e-96636beedb50	passport	hộ chiếu	1
3cccde3b-e7df-4e35-8585-d2418374cf9e	20abb717-63e6-45d5-a22e-96636beedb50	key card	thẻ phòng	2
a4e75b8e-8155-4d83-8c33-298528524c25	20abb717-63e6-45d5-a22e-96636beedb50	check-out	trả phòng	3
a41ee611-c1da-415f-97fe-80ad629f2077	b01c88a4-3ad5-4f98-999b-553830aaf7e6	hello	xin chào	1
12d8a3d7-16c3-408b-a941-5182bbc9792d	b01c88a4-3ad5-4f98-999b-553830aaf7e6	name	tên	2
83de5d29-3517-417b-a608-f45908ffc857	b01c88a4-3ad5-4f98-999b-553830aaf7e6	nice to meet you	rất vui được gặp bạn	3
3325a1f1-6d7a-4fbc-a998-26229db0de91	04ed6a9c-8a8d-4263-b462-b21554d286fe	old	tuổi	1
497d97a0-0d87-4a21-b9f8-11d1b23f6e52	04ed6a9c-8a8d-4263-b462-b21554d286fe	phone number	số điện thoại	2
cc6837e4-4e0d-4ede-9330-5c6368760af2	04ed6a9c-8a8d-4263-b462-b21554d286fe	eighteen	mười tám	3
d8959da9-774d-4b01-b4c4-ed9e85ee113d	6267aa83-f1b9-49ce-bdd3-f3df12db2568	letter	chữ cái	1
c19b2a49-9b83-4dfb-89d3-a5711c9fc557	6267aa83-f1b9-49ce-bdd3-f3df12db2568	spell	đánh vần	2
85e8127f-720f-4f07-8946-4133b2c7ba14	6267aa83-f1b9-49ce-bdd3-f3df12db2568	repeat	lặp lại	3
e7ae10ef-b0fa-4666-9266-86cd283e973b	3c3af2dc-5680-4906-a850-58560747cb9f	blue	màu xanh dương	1
bb3bf5fb-4b1b-4cb2-857a-a507fb386adb	3c3af2dc-5680-4906-a850-58560747cb9f	red	màu đỏ	2
ba251064-265b-4b92-8be7-eaad6bb753d2	3c3af2dc-5680-4906-a850-58560747cb9f	notebook	vở ghi	3
6e05ff84-24f9-49fc-8f73-4d7048192bbd	eb79a03f-9018-410a-937a-6932047adb7d	get up	thức dậy	1
80ec04fa-d418-4580-a7f1-00176059bfa9	eb79a03f-9018-410a-937a-6932047adb7d	dinner	bữa tối	2
5becda06-6a45-4e00-a4c3-c09399dc06d5	eb79a03f-9018-410a-937a-6932047adb7d	go to bed	đi ngủ	3
0ef58ba3-a948-4a29-b5cf-47d673f4ab42	949f3df4-f7a3-4697-8005-22d7b9deaa73	sandwich	bánh mì kẹp	1
1d811331-db6b-46a9-8327-e66ae9288998	949f3df4-f7a3-4697-8005-22d7b9deaa73	orange juice	nước cam	2
05eb422d-6d05-41b7-a041-69f8f2a3f984	949f3df4-f7a3-4697-8005-22d7b9deaa73	dollars	đô la	3
982e65f0-9954-47e4-ae44-b9099df4902b	073560d6-69c3-4c98-9c63-cf724896c2b2	museum	bảo tàng	1
4489b630-10d8-4aa0-bd2a-9566445f6c2d	073560d6-69c3-4c98-9c63-cf724896c2b2	arrive	đến nơi	2
2c726a65-c269-4a10-95b9-3d7aa55d637f	073560d6-69c3-4c98-9c63-cf724896c2b2	minutes	phút	3
d8569168-320c-4cc6-ac38-184dda342a58	5f7512ec-0338-407b-973b-e383a6a91503	appointment	cuộc hẹn	1
6b22c1aa-79af-4f4a-b03c-284142f736b9	5f7512ec-0338-407b-973b-e383a6a91503	receptionist	lễ tân	2
776d65ed-f328-4794-a85d-e397c1b6ce73	5f7512ec-0338-407b-973b-e383a6a91503	fine	ổn	3
\.


--
-- Data for Name: minigamequestions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.minigamequestions (id, levelid, questiontype, contenten, contentvi, audiourl, imageurl, correctanswer, options, orderindex) FROM stdin;
161d2eeb-cbe7-49d4-ac6f-4483ff29ff95	272f6249-9f90-4839-b660-f7fbc4e98927	listening	Good morning	Chào buổi sáng	\N	\N	Good morning	["Good night","Good morning","Good afternoon","Hello"]	2
ae6f30b2-fddb-40ea-9e1b-0319605ba9bd	272f6249-9f90-4839-b660-f7fbc4e98927	listening	Thank you	Cảm ơn	\N	\N	Thank you	["Excuse me","Sorry","Thank you","Please"]	3
425293ba-f0da-4e59-91bd-acbc714a409e	272f6249-9f90-4839-b660-f7fbc4e98927	listenbuild	I go to school	Tôi đi học	\N	\N	I go to school	["I","go","to","school"]	4
79adbd47-36a9-495b-8235-053b39af90d8	272f6249-9f90-4839-b660-f7fbc4e98927	listenbuild	She is my friend	Cô ấy là bạn tôi	\N	\N	She is my friend	["She","is","my","friend"]	5
fdb929ac-a4fa-4392-8ee8-7574a8eb860c	272f6249-9f90-4839-b660-f7fbc4e98927	listenbuild	We eat lunch	Chúng tôi ăn trưa	\N	\N	We eat lunch	["We","eat","lunch"]	6
49e976f4-1a3e-49ea-a8a5-813b24528a5d	272f6249-9f90-4839-b660-f7fbc4e98927	truefalse	Hello	Xin chào	\N	\N	true	[]	7
c00e17c5-4fb2-4268-96ee-3e96957cdbc9	272f6249-9f90-4839-b660-f7fbc4e98927	truefalse	Goodbye	Hẹn gặp lại	\N	\N	true	[]	8
495d4e79-10d6-49b0-b889-d3934b11fdda	272f6249-9f90-4839-b660-f7fbc4e98927	truefalse	Cat	Con chó	\N	\N	false	[]	9
73cded1d-2433-4b19-9b9f-507fd5900971	013fdce3-0f74-4768-a98a-f512e26b0574	listening	How are you	Bạn khỏe không	\N	\N	How are you	["Who are you","Where are you","How are you","What are you"]	2
05dcfd6a-0d77-40a5-adfe-dc42b9bb35ae	013fdce3-0f74-4768-a98a-f512e26b0574	listening	Nice to meet you	Rất vui được gặp bạn	\N	\N	Nice to meet you	["Nice to see you","Glad to meet you","Nice to meet you","Good to see you"]	3
884f76f3-3424-4784-ad99-764bad13bbf1	013fdce3-0f74-4768-a98a-f512e26b0574	listenbuild	He plays football every day	Anh ấy chơi bóng đá mỗi ngày	\N	\N	He plays football every day	["He","plays","football","every","day"]	4
e53d391a-bec8-4fc6-9476-9d489a434d34	013fdce3-0f74-4768-a98a-f512e26b0574	listenbuild	They study English at home	Họ học tiếng Anh ở nhà	\N	\N	They study English at home	["They","study","English","at","home"]	5
82d24c15-4e86-4354-885e-abf9fd091323	013fdce3-0f74-4768-a98a-f512e26b0574	listenbuild	I like reading books	Tôi thích đọc sách	\N	\N	I like reading books	["I","like","reading","books"]	6
17e26915-74c1-4b6e-8864-d1c4ca0216c5	013fdce3-0f74-4768-a98a-f512e26b0574	truefalse	The sun rises in the east	Mặt trời mọc ở hướng đông	\N	\N	true	[]	7
b5e41ef9-6fc1-4f64-860b-8d32e73007ff	013fdce3-0f74-4768-a98a-f512e26b0574	truefalse	Dogs can fly	Chó có thể bay	\N	\N	false	[]	8
edcaea32-8bc4-443d-bb29-ee0bedd09e14	013fdce3-0f74-4768-a98a-f512e26b0574	truefalse	Water boils at 100 degrees	Nước sôi ở 100 độ	\N	\N	true	[]	9
d3e84979-518f-4791-a56b-12240285b53d	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	matching	Enthusiastic	Nhiệt tình	\N	\N	Enthusiastic	[]	0
4b05097c-cf6c-4b03-b876-3d8d3de6c8a8	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	matching	Responsible	Có trách nhiệm	\N	\N	Responsible	[]	1
af4c06ff-2b3b-4261-9875-b34206e184fc	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	listening	Could you repeat that please	Bạn có thể nói lại được không	\N	\N	Could you repeat that please	["Can you say it again","Would you repeat that","Could you repeat that please","Please say it again"]	2
087c0bc2-885f-428c-addc-e8576194f801	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	listening	I would like to order	Tôi muốn gọi món	\N	\N	I would like to order	["I want to order","I would like to order","May I order please","I need to order"]	3
2a4fd7f6-cf3c-45d3-a8b9-915b12c3a5bd	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	listenbuild	She has been studying for three hours	Cô ấy đã học được ba giờ	\N	\N	She has been studying for three hours	["She","has","been","studying","for","three","hours"]	4
60694ece-d613-458f-9cfe-37c829bb389e	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	listenbuild	We should go to the hospital	Chúng ta nên đi bệnh viện	\N	\N	We should go to the hospital	["We","should","go","to","the","hospital"]	5
df955ce1-4e57-4959-aaa2-6e128fb940cb	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	listenbuild	The movie was really interesting	Bộ phim thật sự rất thú vị	\N	\N	The movie was really interesting	["The","movie","was","really","interesting"]	6
74597849-ad3b-4852-8c75-104b78d7f828	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	truefalse	Vietnam is in Southeast Asia	Việt Nam ở Đông Nam Á	\N	\N	true	[]	7
0d0706f9-782d-4a81-8163-13a42a4bbd09	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	truefalse	Paris is the capital of Germany	Paris là thủ đô của Đức	\N	\N	false	[]	8
8413004c-e8d6-432e-9879-e75c8fdba9c3	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	truefalse	The Earth revolves around the Sun	Trái đất quay quanh Mặt Trời	\N	\N	true	[]	9
fe51e3ca-5d98-443c-8d62-428efe667afc	961a2291-c16b-494d-b250-229f06c1988d	listenbuild	You can get there in ten minutes	Bạn có thể đến đó trong mười phút	\N	\N	You can get there in ten minutes	["You","can","get","there","in","ten","minutes"]	5
c58d65aa-4d32-46ae-9132-f4ab890c2b30	961a2291-c16b-494d-b250-229f06c1988d	truefalse	Opposite means across from something	Opposite nghĩa là ở đối diện một thứ gì đó	\N	\N	true	[]	6
2db33166-c57b-4058-9f97-8698479cff4d	961a2291-c16b-494d-b250-229f06c1988d	truefalse	Turn left means rẽ phải	Turn left nghĩa là rẽ phải	\N	\N	false	[]	7
0cffb998-de43-49de-b5b6-982119252116	961a2291-c16b-494d-b250-229f06c1988d	matching	Crosswalk	Vạch qua đường	\N	\N	Crosswalk	[]	8
001df231-ba58-4019-b452-36db13f000c1	d495c777-2742-46e0-94e6-fcad0cdf8666	matching	Assignment	Bài tập được giao	\N	\N	Assignment	[]	0
ee0b41c0-fd26-4293-b0c3-936a3cea9cfd	d495c777-2742-46e0-94e6-fcad0cdf8666	matching	Deadline	Hạn chót	\N	\N	Deadline	[]	1
f84f2e5d-699d-4f81-9d8d-16ffe10655ed	d495c777-2742-46e0-94e6-fcad0cdf8666	listening	Please submit your homework by Friday	Vui lòng nộp bài tập trước thứ Sáu	\N	\N	Please submit your homework by Friday	["Please submit your homework by Friday","Please send your homework by Monday","Please submit your project by Friday","Please finish your homework by Friday"]	2
1c36b0a1-84d3-4a2f-94f0-35b736d469cb	d495c777-2742-46e0-94e6-fcad0cdf8666	listening	I do not understand this question	Tôi không hiểu câu hỏi này	\N	\N	I do not understand this question	["I do not understand this question","I do not answer this question","I do not remember this question","I do not understand this lesson"]	3
67fdc4f7-a263-4a9a-b91c-56f866f0a142	d495c777-2742-46e0-94e6-fcad0cdf8666	listenbuild	Can you explain it again	Bạn có thể giải thích lại không	\N	\N	Can you explain it again	["Can","you","explain","it","again"]	4
06a02a26-8a7c-45bd-a6e9-17566f7e76b3	d495c777-2742-46e0-94e6-fcad0cdf8666	listenbuild	The teacher gave us useful feedback	Giáo viên đã cho chúng tôi phản hồi hữu ích	\N	\N	The teacher gave us useful feedback	["The","teacher","gave","us","useful","feedback"]	5
6b05104c-54ab-4375-8ee3-2c0ad8037c2a	d495c777-2742-46e0-94e6-fcad0cdf8666	truefalse	Deadline means the final time to finish something	Deadline là hạn cuối để hoàn thành việc gì đó	\N	\N	true	[]	6
bfae912e-ebde-4e92-b93f-cd60ef71eecc	d495c777-2742-46e0-94e6-fcad0cdf8666	truefalse	Assignment means kỳ nghỉ	Assignment nghĩa là kỳ nghỉ	\N	\N	false	[]	7
676e9351-ea3a-4dec-a09b-7c9f788a1af5	272f6249-9f90-4839-b660-f7fbc4e98927	matching	Apple	Táo	\N	\N	Táo	["Táo","muối","đường"]	0
b9ea7f3c-b1a0-4413-9caf-7348ac3f2fcf	013fdce3-0f74-4768-a98a-f512e26b0574	matching	Beautiful	Đẹp	\N	\N	Đẹp	["Đẹp","xấu","bình thường"]	0
0687340a-2041-42ce-80f4-11e85db9026c	013fdce3-0f74-4768-a98a-f512e26b0574	matching	Important	Quan trọng	\N	\N	Quan trọng	["Quan trọng","xanh","đỏ"]	1
60dc55f7-0ce1-45f9-bfeb-a87a2d6d6bb6	272f6249-9f90-4839-b660-f7fbc4e98927	matching	Water	Nước	\N	\N	Nước	["Nước","một","hai"]	1
1b8c5752-5abc-4f2e-9ef9-db03b856af38	c13eed73-58fc-4b72-8d11-0afc9232a2f9	matching	Breakfast	Bữa sáng	\N	\N	Breakfast	[]	0
dc3f2c22-128b-4479-9573-216ddec9644d	c13eed73-58fc-4b72-8d11-0afc9232a2f9	matching	Shower	Tắm	\N	\N	Shower	[]	1
4d38285c-5056-468c-8d52-8ece78423ef1	c13eed73-58fc-4b72-8d11-0afc9232a2f9	listening	I wake up at six	Tôi thức dậy lúc sáu giờ	\N	\N	I wake up at six	["I wake up at six","I work at six","I walk at six","I wait at six"]	2
a05fb191-8dda-4f1f-ac5f-2e04aa70f087	c13eed73-58fc-4b72-8d11-0afc9232a2f9	listening	She brushes her teeth	Cô ấy đánh răng	\N	\N	She brushes her teeth	["She washes her face","She brushes her teeth","She cooks breakfast","She drinks water"]	3
c3170b6c-bec3-4f0f-9ea3-633ad878ec51	c13eed73-58fc-4b72-8d11-0afc9232a2f9	listenbuild	I make my bed every morning	Tôi dọn giường mỗi buổi sáng	\N	\N	I make my bed every morning	["I","make","my","bed","every","morning"]	4
3e553134-ab86-430a-9fd6-c12bf222da01	c13eed73-58fc-4b72-8d11-0afc9232a2f9	listenbuild	We have breakfast together	Chúng tôi ăn sáng cùng nhau	\N	\N	We have breakfast together	["We","have","breakfast","together"]	5
79136e8a-9ce0-4274-8428-d8d57e2a7a99	c13eed73-58fc-4b72-8d11-0afc9232a2f9	truefalse	I go to bed at night	Tôi đi ngủ vào ban đêm	\N	\N	true	[]	6
beb0ec91-a0ed-4d2e-9917-b257cf024afb	c13eed73-58fc-4b72-8d11-0afc9232a2f9	truefalse	Breakfast means bữa tối	Breakfast nghĩa là bữa tối	\N	\N	false	[]	7
54552cc3-f96b-4314-b1bf-aa46d073090b	c13eed73-58fc-4b72-8d11-0afc9232a2f9	matching	Commute	Đi lại hằng ngày	\N	\N	Commute	[]	8
92bfac66-d90e-4847-a737-89557c9f0aea	c13eed73-58fc-4b72-8d11-0afc9232a2f9	listening	The bus is late today	Xe buýt hôm nay đến muộn	\N	\N	The bus is late today	["The bus is late today","The bus is early today","The train is late today","The car is late today"]	9
2db5136d-7860-4ed6-b07d-563f8e599cb5	0f74d8a0-b845-4939-95fa-15cbe624b29f	matching	Kitchen	Nhà bếp	\N	\N	Kitchen	[]	0
8ecdd101-84ff-44db-b48c-566e1e49dce1	0f74d8a0-b845-4939-95fa-15cbe624b29f	matching	Living room	Phòng khách	\N	\N	Living room	[]	1
0b1bb7ee-a30a-4efb-bca0-abe19444d506	0f74d8a0-b845-4939-95fa-15cbe624b29f	listening	Please clean your room	Vui lòng dọn phòng của bạn	\N	\N	Please clean your room	["Please clean your room","Please close your room","Please call your room","Please cook your room"]	2
63635414-d75a-470f-96d6-bcf1897e5276	0f74d8a0-b845-4939-95fa-15cbe624b29f	listening	The keys are on the table	Chìa khóa ở trên bàn	\N	\N	The keys are on the table	["The keys are in the bag","The keys are on the table","The keys are under the chair","The keys are near the door"]	3
5c679dd3-d797-4234-b6f3-f27274b379b8	0f74d8a0-b845-4939-95fa-15cbe624b29f	listenbuild	My family watches TV after dinner	Gia đình tôi xem TV sau bữa tối	\N	\N	My family watches TV after dinner	["My","family","watches","TV","after","dinner"]	4
ee2bce0e-f097-425e-8782-9fce1447d5b8	0f74d8a0-b845-4939-95fa-15cbe624b29f	listenbuild	I need to buy some groceries	Tôi cần mua một ít thực phẩm	\N	\N	I need to buy some groceries	["I","need","to","buy","some","groceries"]	5
047da46d-0a32-467a-a61c-21f4154e1cd0	0f74d8a0-b845-4939-95fa-15cbe624b29f	truefalse	A bedroom is a place to sleep	Phòng ngủ là nơi để ngủ	\N	\N	true	[]	6
90a46c34-f928-4030-89f1-79563a2cb0ff	0f74d8a0-b845-4939-95fa-15cbe624b29f	truefalse	A fridge is used to wash clothes	Tủ lạnh dùng để giặt quần áo	\N	\N	false	[]	7
9546e91a-72a3-4c35-9539-eac81664c4fd	0f74d8a0-b845-4939-95fa-15cbe624b29f	matching	Laundry	Đồ giặt / việc giặt đồ	\N	\N	Laundry	[]	8
b66e9566-854b-4b91-ac92-5c8a977828df	0f74d8a0-b845-4939-95fa-15cbe624b29f	listening	Can you open the window	Bạn có thể mở cửa sổ không	\N	\N	Can you open the window	["Can you open the window","Can you close the window","Can you open the door","Can you clean the window"]	9
cdec68b9-8852-460e-8745-a487b20826e5	146f267b-a919-48cb-bcb8-bd2b72042a41	matching	Relax	Thư giãn	\N	\N	Relax	[]	0
a23d29e4-18c4-424a-91d5-862fc4301d31	146f267b-a919-48cb-bcb8-bd2b72042a41	matching	Appointment	Cuộc hẹn	\N	\N	Appointment	[]	1
d64524a4-e589-4b15-ac56-2fd071fd6265	146f267b-a919-48cb-bcb8-bd2b72042a41	listening	We are going to visit our grandparents	Chúng tôi sẽ thăm ông bà	\N	\N	We are going to visit our grandparents	["We are going to visit our grandparents","We are going to visit our parents","We are going to invite our grandparents","We are going to meet our classmates"]	2
3f0461a1-3096-4a30-8289-9d4180e28081	146f267b-a919-48cb-bcb8-bd2b72042a41	listening	I might go shopping this Sunday	Tôi có thể đi mua sắm Chủ nhật này	\N	\N	I might go shopping this Sunday	["I might go shopping this Sunday","I must go shopping this Sunday","I might go jogging this Sunday","I might go swimming this Sunday"]	3
d5244a72-4c57-45e5-a7a0-bfb64ca429fc	146f267b-a919-48cb-bcb8-bd2b72042a41	listenbuild	If it rains, we will stay at home	Nếu trời mưa, chúng tôi sẽ ở nhà	\N	\N	If it rains, we will stay at home	["If","it","rains","we","will","stay","at","home"]	4
9030dafe-ef2c-414b-894c-5255c05d5c88	146f267b-a919-48cb-bcb8-bd2b72042a41	listenbuild	I usually prepare my clothes before a trip	Tôi thường chuẩn bị quần áo trước chuyến đi	\N	\N	I usually prepare my clothes before a trip	["I","usually","prepare","my","clothes","before","a","trip"]	5
cec83506-0422-467f-b8a2-39c7b5969075	146f267b-a919-48cb-bcb8-bd2b72042a41	truefalse	An appointment is a planned meeting	Appointment là một cuộc hẹn đã được lên kế hoạch	\N	\N	true	[]	6
0aef6aff-f082-4484-aad7-f6ae524b1729	146f267b-a919-48cb-bcb8-bd2b72042a41	truefalse	Relax means làm việc quá sức	Relax nghĩa là làm việc quá sức	\N	\N	false	[]	7
53caef35-871c-4ae6-a50e-faae3f82246c	146f267b-a919-48cb-bcb8-bd2b72042a41	matching	Outdoor	Ngoài trời	\N	\N	Outdoor	[]	8
89f7a2c5-e5a8-4269-8bee-ae327cb5f7c3	146f267b-a919-48cb-bcb8-bd2b72042a41	listening	Let us meet at the coffee shop	Chúng ta hãy gặp ở quán cà phê	\N	\N	Let us meet at the coffee shop	["Let us meet at the coffee shop","Let us eat at the coffee shop","Let us meet at the bookshop","Let us wait at the coffee shop"]	9
d5f57987-1036-43de-a572-f394992f72eb	2ef484dc-eba4-4c72-bb6d-93e22387ea22	matching	Passport	Hộ chiếu	\N	\N	Passport	[]	0
6cabf2aa-fdaa-453a-81a1-0d24293ccd30	2ef484dc-eba4-4c72-bb6d-93e22387ea22	matching	Luggage	Hành lý	\N	\N	Luggage	[]	1
3e3dd93b-1226-4c31-8bd6-40ca2ab9f175	2ef484dc-eba4-4c72-bb6d-93e22387ea22	listening	Where is the check-in counter	Quầy làm thủ tục ở đâu	\N	\N	Where is the check-in counter	["Where is the check-in counter","Where is the ticket counter","Where is the information desk","Where is the boarding gate"]	2
b31ff643-d52e-4433-8025-0758acf9bdb1	d495c777-2742-46e0-94e6-fcad0cdf8666	matching	Feedback	Phản hồi	\N	\N	Feedback	[]	8
6dfd79f7-30f9-4fd4-a09e-5187b1d227b9	2ef484dc-eba4-4c72-bb6d-93e22387ea22	listening	My flight is delayed	Chuyến bay của tôi bị hoãn	\N	\N	My flight is delayed	["My flight is delayed","My flight is canceled","My train is delayed","My flight is early"]	3
9edf5694-d069-4720-a8fd-9574bfe65327	2ef484dc-eba4-4c72-bb6d-93e22387ea22	listenbuild	I have one suitcase and one backpack	Tôi có một vali và một ba lô	\N	\N	I have one suitcase and one backpack	["I","have","one","suitcase","and","one","backpack"]	4
b4d5656e-39bb-4a91-8a86-4ab6abee6841	2ef484dc-eba4-4c72-bb6d-93e22387ea22	listenbuild	Please show me your boarding pass	Vui lòng cho tôi xem thẻ lên máy bay	\N	\N	Please show me your boarding pass	["Please","show","me","your","boarding","pass"]	5
1ea36470-5949-41d8-abc6-f56606e74704	2ef484dc-eba4-4c72-bb6d-93e22387ea22	truefalse	A passport is used for international travel	Hộ chiếu dùng cho du lịch quốc tế	\N	\N	true	[]	6
db2c3af3-eb1f-4fad-9440-6b522883f5b9	2ef484dc-eba4-4c72-bb6d-93e22387ea22	truefalse	Luggage means vé máy bay	Luggage nghĩa là vé máy bay	\N	\N	false	[]	7
42bd038b-40b9-460d-8c5d-877b8821b989	2ef484dc-eba4-4c72-bb6d-93e22387ea22	matching	Gate	Cổng lên máy bay	\N	\N	Gate	[]	8
a54764d1-869c-4cb3-80a5-46c226403b25	2ef484dc-eba4-4c72-bb6d-93e22387ea22	listening	The boarding gate has changed	Cổng lên máy bay đã thay đổi	\N	\N	The boarding gate has changed	["The boarding gate has changed","The boarding time has changed","The boarding pass has changed","The boarding gate has closed"]	9
a7de84ce-0956-4b3b-a002-c2dd41f4f94c	b3a06059-9c12-4ddd-836a-dce3ee532980	matching	Reservation	Đặt phòng	\N	\N	Reservation	[]	0
1cbe6339-2d78-4b61-86c4-6471d848d516	b3a06059-9c12-4ddd-836a-dce3ee532980	matching	Reception	Lễ tân	\N	\N	Reception	[]	1
2802ce63-f133-4c44-b3d4-755bd0036357	b3a06059-9c12-4ddd-836a-dce3ee532980	listening	I have a reservation under the name Linh	Tôi có đặt phòng dưới tên Linh	\N	\N	I have a reservation under the name Linh	["I have a reservation under the name Linh","I have a question under the name Linh","I made a reservation for lunch","I have a room with Linh"]	2
2a4aac39-0b53-42e0-aa67-62be31c22418	b3a06059-9c12-4ddd-836a-dce3ee532980	listening	Could I have a room with a window	Tôi có thể lấy phòng có cửa sổ không	\N	\N	Could I have a room with a window	["Could I have a room with a window","Could I have a room with a balcony","Could I have a room near the window","Could I have a room without a window"]	3
0d3d761a-144f-4b18-9d87-64e815496803	b3a06059-9c12-4ddd-836a-dce3ee532980	listenbuild	The room is clean and comfortable	Căn phòng sạch sẽ và thoải mái	\N	\N	The room is clean and comfortable	["The","room","is","clean","and","comfortable"]	4
519d20fd-35da-448b-9705-26312e69dd90	b3a06059-9c12-4ddd-836a-dce3ee532980	listenbuild	Breakfast is included in the price	Bữa sáng được bao gồm trong giá	\N	\N	Breakfast is included in the price	["Breakfast","is","included","in","the","price"]	5
55f4a2bd-3912-4cb5-b474-06ed364c2e47	b3a06059-9c12-4ddd-836a-dce3ee532980	truefalse	Reception is the hotel front desk	Reception là quầy lễ tân khách sạn	\N	\N	true	[]	6
61470e99-437e-4545-aa91-5bd8194bffbf	b3a06059-9c12-4ddd-836a-dce3ee532980	truefalse	Reservation means trả phòng	Reservation nghĩa là trả phòng	\N	\N	false	[]	7
f78022f0-5351-433a-8f70-682571a3a253	b3a06059-9c12-4ddd-836a-dce3ee532980	matching	Key card	Thẻ khóa phòng	\N	\N	Key card	[]	8
2ef9467c-51f5-473a-b52b-bf813b08a936	b3a06059-9c12-4ddd-836a-dce3ee532980	listening	What time is check-out	Mấy giờ trả phòng	\N	\N	What time is check-out	["What time is check-out","What time is check-in","What time is breakfast","What time is the meeting"]	9
3e8334e2-b0ab-4c12-9659-232dc5d7e0da	961a2291-c16b-494d-b250-229f06c1988d	matching	Intersection	Ngã tư	\N	\N	Intersection	[]	0
8e515c70-93a5-473e-8eee-77db5192bea5	961a2291-c16b-494d-b250-229f06c1988d	matching	Pharmacy	Nhà thuốc	\N	\N	Pharmacy	[]	1
7d52c928-2453-4af3-98d3-331925cfb319	961a2291-c16b-494d-b250-229f06c1988d	listening	Go straight and turn left at the bank	Đi thẳng và rẽ trái ở ngân hàng	\N	\N	Go straight and turn left at the bank	["Go straight and turn left at the bank","Go straight and turn right at the bank","Go straight and turn left at the park","Go across and turn left at the bank"]	2
04403ef9-b35c-41c6-8ba7-d9d6e918502f	961a2291-c16b-494d-b250-229f06c1988d	listening	Is there a bus stop near here	Có trạm xe buýt gần đây không	\N	\N	Is there a bus stop near here	["Is there a bus stop near here","Is there a train station near here","Is there a bus stop over there","Is there a taxi stand near here"]	3
0c6ec0ce-f60b-483a-a51a-2ee0516ee00f	961a2291-c16b-494d-b250-229f06c1988d	listenbuild	The museum is opposite the post office	Bảo tàng ở đối diện bưu điện	\N	\N	The museum is opposite the post office	["The","museum","is","opposite","the","post","office"]	4
548e69e3-7fe5-41de-85f4-8a909f6aa5c3	961a2291-c16b-494d-b250-229f06c1988d	listening	Could you show me on the map	Bạn có thể chỉ cho tôi trên bản đồ không	\N	\N	Could you show me on the map	["Could you show me on the map","Could you call me on the map","Could you show me the menu","Could you show me at the map"]	9
a4656a51-2e7e-4d49-8926-3cf822a289eb	d495c777-2742-46e0-94e6-fcad0cdf8666	listening	May I ask a question	Em có thể hỏi một câu không	\N	\N	May I ask a question	["May I ask a question","May I answer a question","May I make a question","May I repeat a question"]	9
57a4213f-6356-45b5-92e6-33be2e0b54f6	bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	matching	Meeting	Cuộc họp	\N	\N	Meeting	[]	0
e0a681a0-4718-4c2e-beaa-1f725ccd1400	bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	matching	Report	Báo cáo	\N	\N	Report	[]	1
88bc0257-60be-48db-8c77-3a7d59b98f38	bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	listening	Can we move the meeting to tomorrow	Chúng ta có thể dời cuộc họp sang ngày mai không	\N	\N	Can we move the meeting to tomorrow	["Can we move the meeting to tomorrow","Can we start the meeting tomorrow","Can we cancel the meeting tomorrow","Can we move the report to tomorrow"]	2
0dabc15b-9a18-4a9c-ad8c-7ee564f9ff32	bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	listening	I will send the report this afternoon	Tôi sẽ gửi báo cáo chiều nay	\N	\N	I will send the report this afternoon	["I will send the report this afternoon","I will read the report this afternoon","I will send the email this afternoon","I will write the report tomorrow"]	3
95112418-f717-4195-ad11-07590d9b12f2	bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	listenbuild	Our team is working on a new project	Nhóm chúng tôi đang làm một dự án mới	\N	\N	Our team is working on a new project	["Our","team","is","working","on","a","new","project"]	4
0d7f1da9-45c9-40a4-b8ee-7dbfbcf60fe0	bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	listenbuild	Could you share the file with me	Bạn có thể chia sẻ file với tôi không	\N	\N	Could you share the file with me	["Could","you","share","the","file","with","me"]	5
e847e764-740a-434b-b691-245484621257	bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	truefalse	A report presents information clearly	Báo cáo trình bày thông tin một cách rõ ràng	\N	\N	true	[]	6
d66184fd-651d-4261-a667-1ff158587b6e	bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	truefalse	Meeting means đi nghỉ	Meeting nghĩa là đi nghỉ	\N	\N	false	[]	7
38c09cf0-4951-4826-8167-77f18e62163a	bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	matching	Colleague	Đồng nghiệp	\N	\N	Colleague	[]	8
1891266c-8ebc-4844-8353-52f3aa5b38a8	bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	listening	Let us review the plan together	Chúng ta hãy cùng xem lại kế hoạch	\N	\N	Let us review the plan together	["Let us review the plan together","Let us remove the plan together","Let us rewrite the plan tomorrow","Let us receive the plan together"]	9
5d5d1b8e-a42b-4ec7-927f-e97dec6ed0e7	f72f920f-6bb2-4bf6-a275-eda18bd8f269	matching	Attachment	Tệp đính kèm	\N	\N	Attachment	[]	0
2460d517-4c5c-4c78-acff-80136b5fb3fd	f72f920f-6bb2-4bf6-a275-eda18bd8f269	matching	Confirm	Xác nhận	\N	\N	Confirm	[]	1
d34f1b45-0319-4358-932c-e099d98a25f2	f72f920f-6bb2-4bf6-a275-eda18bd8f269	listening	Please find the attached document	Vui lòng xem tài liệu đính kèm	\N	\N	Please find the attached document	["Please find the attached document","Please sign the attached document","Please send the attached document","Please open the attached document"]	2
468fb585-fd36-4ffd-8195-35530623a95d	f72f920f-6bb2-4bf6-a275-eda18bd8f269	listening	I look forward to your response	Tôi mong nhận được phản hồi của bạn	\N	\N	I look forward to your response	["I look forward to your response","I look forward to your report","I look forward to your request","I look forward to your result"]	3
d2a20890-1c52-40ad-9118-096932e13f2b	f72f920f-6bb2-4bf6-a275-eda18bd8f269	listenbuild	Could you confirm the schedule by today	Bạn có thể xác nhận lịch trình trong hôm nay không	\N	\N	Could you confirm the schedule by today	["Could","you","confirm","the","schedule","by","today"]	4
716bc64c-a547-4af9-b3f1-32d4fe7566e4	f72f920f-6bb2-4bf6-a275-eda18bd8f269	listenbuild	Thank you for your quick reply	Cảm ơn phản hồi nhanh của bạn	\N	\N	Thank you for your quick reply	["Thank","you","for","your","quick","reply"]	5
b8ac3cdd-f735-45a0-996b-1df93cf923ef	f72f920f-6bb2-4bf6-a275-eda18bd8f269	truefalse	Attachment is a file sent with an email	Attachment là tệp được gửi kèm email	\N	\N	true	[]	6
7a7b77f4-6d40-4d1d-9a6b-c87a0a7a145e	f72f920f-6bb2-4bf6-a275-eda18bd8f269	truefalse	Confirm means từ chối	Confirm nghĩa là từ chối	\N	\N	false	[]	7
30f2aebb-11f7-4acc-a9e5-d441e9386abf	f72f920f-6bb2-4bf6-a275-eda18bd8f269	matching	Regarding	Về việc / liên quan đến	\N	\N	Regarding	[]	8
14bc6df9-a714-4bb4-ada2-b36ce133b521	f72f920f-6bb2-4bf6-a275-eda18bd8f269	listening	I am writing regarding your request	Tôi viết email liên quan đến yêu cầu của bạn	\N	\N	I am writing regarding your request	["I am writing regarding your request","I am reading regarding your request","I am writing about your result","I am waiting regarding your request"]	9
b289fc79-f454-4899-8b06-e91a859a3ba6	272f6249-9f90-4839-b660-f7fbc4e98927	speakrepeat	I drink water every day	Tôi uống nước mỗi ngày	\N	\N	I drink water every day	{"passScore":70}	11
046e2acb-f7a1-4c9f-84c3-2842b7b06a76	013fdce3-0f74-4768-a98a-f512e26b0574	speakrepeat	She goes to school by bus	Cô ấy đi học bằng xe buýt	\N	\N	She goes to school by bus	{"passScore":70}	10
33d63a3e-f50b-4174-a8fc-93523f2fc780	013fdce3-0f74-4768-a98a-f512e26b0574	speakrepeat	We are making weekend plans	Chúng tôi đang lên kế hoạch cuối tuần	\N	\N	We are making weekend plans	{"passScore":70}	11
6e496c61-c49b-48e0-be2f-6f0dd93f608e	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	speakrepeat	Please speak slowly	Vui lòng nói chậm lại	\N	\N	Please speak slowly	{"passScore":70}	10
e54a4cd1-807a-4112-b81c-911a07c06299	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	speakrepeat	I would like some orange juice	Tôi muốn một ít nước cam	\N	\N	I would like some orange juice	{"passScore":70}	11
be8b4e75-4e6e-48d7-8cf3-7ecca34767c2	c13eed73-58fc-4b72-8d11-0afc9232a2f9	speakrepeat	The weather is nice today	Thời tiết hôm nay đẹp	\N	\N	The weather is nice today	{"passScore":70}	10
dc8e15dc-99de-4abf-b815-32a6820099c0	c13eed73-58fc-4b72-8d11-0afc9232a2f9	speakrepeat	Can you help me with this	Bạn có thể giúp tôi việc này không	\N	\N	Can you help me with this	{"passScore":70}	11
f9405d06-92ce-423e-b513-7033a1c431da	0f74d8a0-b845-4939-95fa-15cbe624b29f	speakrepeat	I usually have breakfast at seven	Tôi thường ăn sáng lúc bảy giờ	\N	\N	I usually have breakfast at seven	{"passScore":70}	10
1c3cd025-96d9-42bb-833a-52d0f9a68d23	0f74d8a0-b845-4939-95fa-15cbe624b29f	speakrepeat	This lesson is a little difficult	Bài học này hơi khó	\N	\N	This lesson is a little difficult	{"passScore":70}	11
e532beda-66cc-4d5f-be88-7b939ed0a407	146f267b-a919-48cb-bcb8-bd2b72042a41	speakrepeat	Could you repeat the question	Bạn có thể lặp lại câu hỏi không	\N	\N	Could you repeat the question	{"passScore":70}	10
0e042e6f-3351-4c44-aa86-f79ca9b145c6	146f267b-a919-48cb-bcb8-bd2b72042a41	speakrepeat	I am practicing English pronunciation	Tôi đang luyện phát âm tiếng Anh	\N	\N	I am practicing English pronunciation	{"passScore":70}	11
58c4fa91-7723-4c7c-80fb-3abb42834be0	2ef484dc-eba4-4c72-bb6d-93e22387ea22	speakrepeat	A cat and a dog	Một con mèo và một con chó	\N	\N	A cat and a dog	{"passScore":70}	10
bb81eb69-2d95-4671-b243-e499bd9f94ea	2ef484dc-eba4-4c72-bb6d-93e22387ea22	speakrepeat	I drink water every day	Tôi uống nước mỗi ngày	\N	\N	I drink water every day	{"passScore":70}	11
4127978b-d2e5-49f7-ad03-40522f818378	b3a06059-9c12-4ddd-836a-dce3ee532980	speakrepeat	She goes to school by bus	Cô ấy đi học bằng xe buýt	\N	\N	She goes to school by bus	{"passScore":70}	10
127f4b2d-d063-48cc-ae5a-6067eb6fc8b3	b3a06059-9c12-4ddd-836a-dce3ee532980	speakrepeat	We are making weekend plans	Chúng tôi đang lên kế hoạch cuối tuần	\N	\N	We are making weekend plans	{"passScore":70}	11
d37e131d-53ad-4ba7-ad9e-d9f62253ac8f	961a2291-c16b-494d-b250-229f06c1988d	speakrepeat	Please speak slowly	Vui lòng nói chậm lại	\N	\N	Please speak slowly	{"passScore":70}	10
4c707c89-f482-4271-8833-a3bca3618fa0	961a2291-c16b-494d-b250-229f06c1988d	speakrepeat	I would like some orange juice	Tôi muốn một ít nước cam	\N	\N	I would like some orange juice	{"passScore":70}	11
93faa659-9863-4165-ab70-07b9c422948a	d495c777-2742-46e0-94e6-fcad0cdf8666	speakrepeat	The weather is nice today	Thời tiết hôm nay đẹp	\N	\N	The weather is nice today	{"passScore":70}	10
825b5730-dae6-42c4-a32c-4445353c8fa3	d495c777-2742-46e0-94e6-fcad0cdf8666	speakrepeat	Can you help me with this	Bạn có thể giúp tôi việc này không	\N	\N	Can you help me with this	{"passScore":70}	11
53f2144f-1ec3-468b-a7d0-829fc0c71b0a	bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	speakrepeat	I usually have breakfast at seven	Tôi thường ăn sáng lúc bảy giờ	\N	\N	I usually have breakfast at seven	{"passScore":70}	10
9eb09798-ba71-4731-af64-93746f1304c7	bfdeabc4-79ce-44be-ae9d-d8d58bf6ab30	speakrepeat	This lesson is a little difficult	Bài học này hơi khó	\N	\N	This lesson is a little difficult	{"passScore":70}	11
95f774d7-fb4f-48f8-a3e5-a2f0fe50b15e	f72f920f-6bb2-4bf6-a275-eda18bd8f269	speakrepeat	Could you repeat the question	Bạn có thể lặp lại câu hỏi không	\N	\N	Could you repeat the question	{"passScore":70}	10
0e350ee8-61ff-48c0-9eb6-1f1a8ae40cc0	f72f920f-6bb2-4bf6-a275-eda18bd8f269	speakrepeat	I am practicing English pronunciation	Tôi đang luyện phát âm tiếng Anh	\N	\N	I am practicing English pronunciation	{"passScore":70}	11
7a2d4384-eb33-40e0-bb02-33fc798b8d6b	272f6249-9f90-4839-b660-f7fbc4e98927	speakrepeat	A cat and a dog	Một con mèo và một con chó	\N	\N	A cat and a dog	{"passScore":70}	10
\.


--
-- Data for Name: notificationrecipients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notificationrecipients (id, notificationid, userid, readat, emailedat, emailerror, createdat) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, title, message, type, linkurl, audience, createdby, createdat) FROM stdin;
\.


--
-- Data for Name: passwordresetcodes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.passwordresetcodes (id, userid, email, codehash, expiresat, usedat, createdat) FROM stdin;
\.


--
-- Data for Name: paymentrequests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.paymentrequests (id, userid, plan, amount, status, transfercontent, createdat, completedat, gateway, sepaytransactionid, rawpayload) FROM stdin;
\.


--
-- Data for Name: placementminigamequestions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.placementminigamequestions (id, questiontype, contenten, contentvi, audiourl, imageurl, correctanswer, options, difficulty, pointratio, isactive, orderindex, createdat, updatedat) FROM stdin;
aff99d7a-d404-4f8c-8182-f8c1b9163abc	listening	This is my pen	Đây là bút của tôi	\N	\N	This is my pen	["This is my pen", "This is my bag", "That is my pen", "This is your pen"]	easy	1.00	t	10	2026-06-27 20:57:03.150143+07	2026-06-27 20:57:03.150143+07
1bd213e9-939c-4b71-845f-897e09f23795	listening	She is happy	Cô ấy vui	\N	\N	She is happy	["She is happy", "She is hungry", "He is happy", "She is busy"]	easy	1.00	t	11	2026-06-27 20:57:03.152916+07	2026-06-27 20:57:03.152916+07
c8d053ad-34d8-4a04-aa2f-3464a631427f	listening	Could you repeat that more slowly?	Bạn có thể nhắc lại chậm hơn không?	\N	\N	Could you repeat that more slowly?	["Could you repeat that more slowly?", "Could you read that more loudly?", "Could you write that down for me?", "Could you speak to my teacher?"]	hard	1.50	t	12	2026-06-20 15:09:19.758216+07	2026-06-27 20:57:03.1547+07
6445733f-ffcb-496b-b459-5c7f634981b9	truefalse	The report must be finished before the manager arrives	Bản báo cáo phải được hoàn thành trước khi quản lý đến	\N	\N	true	\N	hard	1.50	t	28	2026-06-27 20:57:03.188943+07	2026-06-27 20:57:03.188943+07
71fc1ab5-f909-46d8-91fe-13e4adb02b65	speakrepeat	I can help you	Tôi có thể giúp bạn	\N	\N	I can help you	{"passScore": 70}	easy	1.00	t	29	2026-06-20 15:09:19.772605+07	2026-06-27 20:57:03.190969+07
879032b3-4411-4c9c-bbd0-b1f7f137f3a0	speakrepeat	Open the door please	Vui lòng mở cửa	\N	\N	Open the door please	{"passScore": 70}	easy	1.00	t	30	2026-06-20 15:09:19.774587+07	2026-06-27 20:57:03.1935+07
207b1e3b-2ee7-493e-90df-2065a3fc8866	speakrepeat	I need a glass of water	Tôi cần một ly nước	\N	\N	I need a glass of water	{"passScore": 70}	easy	1.00	t	31	2026-06-27 20:57:03.195569+07	2026-06-27 20:57:03.195569+07
34cf7d6f-1b55-4e78-bf78-6d693181601f	listening	The meeting has been moved to Friday afternoon	Cuộc họp đã được chuyển sang chiều thứ sáu	\N	\N	The meeting has been moved to Friday afternoon	["The meeting has been moved to Friday afternoon", "The meeting has been canceled this Friday", "The meeting will start on Monday morning", "The meeting is in the main office"]	hard	1.50	t	13	2026-06-27 20:57:03.156394+07	2026-06-27 20:57:03.156394+07
b80683d1-3500-4b97-9a9c-62e3f667218e	listening	Students should submit their assignments before midnight	Học sinh nên nộp bài trước nửa đêm	\N	\N	Students should submit their assignments before midnight	["Students should submit their assignments before midnight", "Students can start their assignments after midnight", "Teachers should return assignments before midnight", "Students should print their assignments in class"]	hard	1.50	t	14	2026-06-27 20:57:03.157961+07	2026-06-27 20:57:03.157961+07
58007f9f-8f86-42b0-aa2e-164ae77c05de	listenbuild	I am a student	Tôi là học sinh	\N	\N	I am a student	["I", "am", "a", "student", "teacher"]	easy	1.00	t	15	2026-06-20 15:09:19.76033+07	2026-06-27 20:57:03.159968+07
f288aeba-bba6-4f73-b83c-f42548e2482e	listenbuild	We go to school	Chúng tôi đi học	\N	\N	We go to school	["We", "go", "to", "school", "home"]	easy	1.00	t	16	2026-06-20 15:09:19.762362+07	2026-06-27 20:57:03.162328+07
5ff97a9f-fe26-445f-80bb-d9396d0b175d	listenbuild	They play football	Họ chơi bóng đá	\N	\N	They play football	["They", "play", "football", "watch", "music"]	easy	1.00	t	17	2026-06-27 20:57:03.16454+07	2026-06-27 20:57:03.16454+07
5e15dd48-39ef-47ad-8a76-f0c147e377eb	listenbuild	My father cooks dinner	Bố tôi nấu bữa tối	\N	\N	My father cooks dinner	["My", "father", "cooks", "dinner", "mother"]	easy	1.00	t	18	2026-06-27 20:57:03.166702+07	2026-06-27 20:57:03.166702+07
0b5165ce-97c0-4105-8c69-d131b6df1526	listenbuild	She usually takes the bus to work	Cô ấy thường đi xe buýt đến chỗ làm	\N	\N	She usually takes the bus to work	["She", "usually", "takes", "the", "bus", "to", "work", "walks"]	hard	1.50	t	19	2026-06-20 15:09:19.76438+07	2026-06-27 20:57:03.16922+07
56963467-fad5-4a32-931f-e6a69e609e23	listenbuild	I have never visited that museum before	Tôi chưa từng đến bảo tàng đó trước đây	\N	\N	I have never visited that museum before	["I", "have", "never", "visited", "that", "museum", "before", "often"]	hard	1.50	t	20	2026-06-27 20:57:03.171476+07	2026-06-27 20:57:03.171476+07
85a92cf9-e8ab-4d0a-afb9-c3f4de621465	listenbuild	The teacher asked us to explain our answer	Giáo viên yêu cầu chúng tôi giải thích câu trả lời	\N	\N	The teacher asked us to explain our answer	["The", "teacher", "asked", "us", "to", "explain", "our", "answer", "question"]	hard	1.50	t	21	2026-06-27 20:57:03.173483+07	2026-06-27 20:57:03.173483+07
bb3aa135-3c7b-46df-93da-c9e7ded8ef8b	truefalse	A cat is an animal	Mèo là một con vật	\N	\N	true	\N	easy	1.00	t	22	2026-06-20 15:09:19.76666+07	2026-06-27 20:57:03.175986+07
f92728be-60ac-4df2-81de-e54596dc45ea	truefalse	The dog is black	Con chó màu trắng	\N	\N	false	\N	easy	1.00	t	23	2026-06-20 15:09:19.76852+07	2026-06-27 20:57:03.178419+07
669dec93-c46a-431a-a78f-f9fa92339409	truefalse	Two plus two equals four	Hai cộng hai bằng bốn	\N	\N	true	\N	easy	1.00	t	24	2026-06-27 20:57:03.18076+07	2026-06-27 20:57:03.18076+07
2d868243-f549-4fa0-9775-256a5e59dd05	truefalse	Fish can fly in the sky	Cá có thể bay trên trời	\N	\N	false	\N	easy	1.00	t	25	2026-06-27 20:57:03.182573+07	2026-06-27 20:57:03.182573+07
b9723572-bc67-42ce-b730-90a8974e11f3	truefalse	He has lived here for three years	Anh ấy đã sống ở đây được ba năm	\N	\N	true	\N	hard	1.50	t	26	2026-06-20 15:09:19.770557+07	2026-06-27 20:57:03.184488+07
32fc1e64-95d5-48fd-9718-55eee56267d9	truefalse	Although it was raining, they cancelled the umbrella	Mặc dù trời mưa, họ đã hủy chiếc ô	\N	\N	false	\N	hard	1.50	t	27	2026-06-27 20:57:03.186559+07	2026-06-27 20:57:03.186559+07
788cf96f-086b-4dad-91a5-bc5eaa68dfdb	speakrepeat	Can you see the board?	Bạn có thể nhìn thấy bảng không?	\N	\N	Can you see the board?	{"passScore": 70}	easy	1.00	t	32	2026-06-27 20:57:03.197907+07	2026-06-27 20:57:03.197907+07
578b761e-2a96-4274-bd29-a1ccfdde0257	speakrepeat	I would appreciate it if you could send the file today	Tôi sẽ rất cảm kích nếu bạn có thể gửi tệp hôm nay	\N	\N	I would appreciate it if you could send the file today	{"passScore": 75}	hard	1.50	t	34	2026-06-27 20:57:03.201885+07	2026-06-27 20:57:03.201885+07
5e29017f-e4e3-4a0f-9095-5ca313ce8e9c	speakrepeat	The weather changed quickly after lunch	Thời tiết thay đổi nhanh sau bữa trưa	\N	\N	The weather changed quickly after lunch	{"passScore": 75}	hard	1.50	t	33	2026-06-20 15:09:19.776515+07	2026-06-27 20:57:03.199842+07
7aec2652-f25f-4e43-8b13-8318ea10e328	truefalse	cat	con mèo	\N	\N	true	[]	easy	1.00	f	16	2026-06-27 20:49:57.610442+07	2026-06-27 20:57:03.242267+07
43a73a09-39b6-43f8-9f51-69204c11f9b6	matching	apple	quả táo	\N	\N	quả táo	["quả táo", "quả chuối", "quyển sách", "cái ghế"]	easy	1.00	t	1	2026-06-20 15:09:19.739053+07	2026-06-27 20:57:03.121838+07
ee9b2f2e-6609-4b87-8813-3e64a0babd8b	matching	train	tàu hỏa	\N	\N	tàu hỏa	["xe đạp", "tàu hỏa", "máy bay", "xe buýt"]	easy	1.00	t	2	2026-06-20 15:09:19.749508+07	2026-06-27 20:57:03.131288+07
73285637-043a-48a7-a19b-115685d6a050	matching	book	quyển sách	\N	\N	quyển sách	["cây bút", "quyển sách", "cái bàn", "cửa sổ"]	easy	1.00	t	3	2026-06-27 20:57:03.13355+07	2026-06-27 20:57:03.13355+07
8fa0ab12-5a19-432d-8e93-93f6f48cfe3c	matching	water	nước	\N	\N	nước	["cơm", "sữa", "nước", "bánh mì"]	easy	1.00	t	4	2026-06-27 20:57:03.136409+07	2026-06-27 20:57:03.136409+07
1dcb9d1b-99e7-4dbf-ba55-e960100d0787	matching	responsibility	trách nhiệm	\N	\N	trách nhiệm	["sự thuận tiện", "trách nhiệm", "lời mời", "kỳ nghỉ"]	hard	1.50	t	5	2026-06-20 15:09:19.751638+07	2026-06-27 20:57:03.138857+07
d1594696-0288-476c-8f59-a5d61af24b8a	matching	opportunity	cơ hội	\N	\N	cơ hội	["kinh nghiệm", "cơ hội", "thử thách", "mục tiêu"]	hard	1.50	t	6	2026-06-27 20:57:03.14119+07	2026-06-27 20:57:03.14119+07
ba4fcae3-c276-4ab0-a4a2-a6d46e212eaa	matching	environment	môi trường	\N	\N	môi trường	["môi trường", "giáo dục", "sức khỏe", "công nghệ"]	hard	1.50	t	7	2026-06-27 20:57:03.143563+07	2026-06-27 20:57:03.143563+07
0b719a6e-de4a-4a7e-94e4-9a753545b424	listening	Good morning	Chào buổi sáng	\N	\N	Good morning	["Good morning", "Good night", "Good evening", "Goodbye"]	easy	1.00	t	8	2026-06-20 15:09:19.75407+07	2026-06-27 20:57:03.145575+07
cad61b5d-b7e5-433a-a887-37c903ca4990	listening	I like milk	Tôi thích sữa	\N	\N	I like milk	["I like milk", "I like tea", "I need milk", "I drink water"]	easy	1.00	t	9	2026-06-20 15:09:19.756217+07	2026-06-27 20:57:03.147848+07
db5168c1-a17b-48c0-b1b7-2ae461dc7e94	speakrepeat	Learning a language requires patience and regular practice	Học một ngôn ngữ cần sự kiên nhẫn và luyện tập đều đặn	\N	\N	Learning a language requires patience and regular practice	{"passScore": 75}	hard	1.50	t	35	2026-06-27 20:57:03.203978+07	2026-06-27 20:57:03.203978+07
\.


--
-- Data for Name: readinglessons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.readinglessons (id, title, description, level, topic, objective, duration, passagetitle, audiourl, orderindex, createdat, updatedat, isfoundation) FROM stdin;
671cda22-546d-4aee-a195-ec5068c0fc48	A Small Family	Đọc đoạn ngắn về các thành viên trong gia đình.	A1	Family	Nhận biết từ vựng gia đình và thông tin cơ bản.	8 phút	My Family		1	2026-06-18 14:30:58.633595+07	2026-06-26 00:24:17.893294+07	t
1b1e767c-01e8-470c-a9f3-124b116cfe78	My School Bag	Đọc đoạn ngắn về đồ vật trong cặp sách.	A1	School objects	Hiểu câu mô tả đồ vật quen thuộc.	8 phút	In My Bag		2	2026-06-18 14:30:58.633595+07	2026-06-26 00:24:17.904639+07	t
f052f18c-d46d-4c5a-ac03-6ddefbdbad07	The Weather Today	Đọc bản tin thời tiết rất ngắn.	A1	Weather	Hiểu từ vựng thời tiết và lời khuyên đơn giản.	9 phút	Sunny Morning		3	2026-06-18 14:30:58.633595+07	2026-06-26 00:24:17.905874+07	t
2a33464f-ee6a-49e3-bd92-b1de168fe9ed	My Name Is Linh	Đọc đoạn giới thiệu bản thân rất ngắn.	A0	Self introduction	Đọc đoạn giới thiệu bản thân rất ngắn.	5 phút	A Short Introduction		4	2026-06-12 09:39:59.0561+07	2026-06-26 00:24:17.907289+07	t
ef44c251-5fbc-48a0-9570-9e492f6d695c	Things In My Classroom	Đọc tên đồ vật quen thuộc trong lớp học.	A0	Classroom	Đọc tên đồ vật quen thuộc trong lớp học.	5 phút	My Classroom		5	2026-06-12 09:39:59.098622+07	2026-06-26 00:24:17.9087+07	t
873d0162-3e45-4a54-9b86-5bddd9cc54f4	A Healthy Breakfast	Đọc đoạn văn ngắn về bữa sáng lành mạnh.	A1	Health	Hiểu ý chính, nhận biết thực phẩm và thói quen đơn giản.	7 phút	Why Breakfast Matters		6	2026-05-22 09:40:07.008941+07	2026-06-26 00:24:17.910083+07	f
357c7c32-c4e6-43e5-8280-8d377a6f94c8	A Weekend Market	Read about a local market and answer detail questions.	A1	Shopping	Understand prices, items, and simple preferences.	10 phút	Saturday Market		7	2026-06-18 14:30:58.633595+07	2026-06-26 00:24:17.913427+07	f
4e681afa-0983-4586-bad2-0f7e55d8dfc8	A New Neighbor	Read a short story about meeting a neighbor.	A2	Community	Identify people, actions, and feelings in a story.	11 phút	Next Door		8	2026-06-18 14:30:58.633595+07	2026-06-26 00:24:17.925501+07	f
c32c90c8-1907-40de-b87b-1e55d70cb505	The City Library	Đọc thông báo về thư viện thành phố.	A2	Community	Tìm thông tin về giờ mở cửa, dịch vụ và quy định.	9 phút	New Services At The City Library		9	2026-05-22 09:40:07.029239+07	2026-06-26 00:24:17.930019+07	f
5c39d961-4038-4326-8204-3790aa5689f2	Saving Water At Home	Read a practical text about saving water.	A2	Environment	Understand advice and reasons in a simple article.	12 phút	Use Less Water		10	2026-06-18 14:30:58.633595+07	2026-06-26 00:24:17.9316+07	f
\.


--
-- Data for Name: readingparagraphs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.readingparagraphs (id, lessonid, content, orderindex) FROM stdin;
bf8713ce-66ff-48d4-8499-eaec9d826039	873d0162-3e45-4a54-9b86-5bddd9cc54f4	Many students skip breakfast because they are busy in the morning. This can make them feel tired before lunch.	0
63e1edba-b405-4587-a674-d153ea6eae06	873d0162-3e45-4a54-9b86-5bddd9cc54f4	A healthy breakfast does not need to be complicated. A banana, an egg, some bread, or a bowl of rice can give the body energy.	1
d47a1355-3be0-4af4-aa90-4dc6863b89ce	873d0162-3e45-4a54-9b86-5bddd9cc54f4	Drinking water is also important. It is better to drink water or milk instead of sweet drinks every morning.	2
8c9037f8-2966-4d55-8a8f-f7fa5fc43f72	c32c90c8-1907-40de-b87b-1e55d70cb505	The City Library is open from 8 a.m. to 7 p.m. from Monday to Saturday. It is closed on Sundays.	0
10ce0a29-00c0-45f3-bb93-66dd895405da	c32c90c8-1907-40de-b87b-1e55d70cb505	Visitors can read newspapers, use computers, and borrow up to five books with a membership card. Books must be returned within two weeks.	1
c31c81e4-d439-4ffa-9074-e82f8a0d4851	c32c90c8-1907-40de-b87b-1e55d70cb505	The second floor is a quiet area for reading and studying. Phone calls are not allowed there.	2
dcdf8467-d59d-47ed-92f2-1153e5f43f77	2a33464f-ee6a-49e3-bd92-b1de168fe9ed	My name is Linh. I am a student. I live in Da Nang.	1
7885ac62-af71-45df-829d-a9a44a804c97	2a33464f-ee6a-49e3-bd92-b1de168fe9ed	I like English. I study English every day.	2
8f87aa66-ef8d-454d-a7a5-efbbc746fdea	ef44c251-5fbc-48a0-9570-9e492f6d695c	This is my classroom. There is a board, a desk, and many chairs.	1
000225d7-66e3-4f4b-945a-b2202d6bee65	ef44c251-5fbc-48a0-9570-9e492f6d695c	My book is on the desk. My pen is in my bag.	2
4184d9dc-705d-42ce-8ad1-1314cc00ca13	671cda22-546d-4aee-a195-ec5068c0fc48	My name is Mai. I live with my father, my mother, and my little brother.	1
1a5ef695-f117-44c1-be10-6fed362e9640	671cda22-546d-4aee-a195-ec5068c0fc48	My father is a driver. My mother is a nurse. My brother is six years old.	2
eb382aca-a82f-4d76-9525-087cc8a24544	671cda22-546d-4aee-a195-ec5068c0fc48	We eat dinner together every evening.	3
9b9b5884-006f-4295-8af9-2a657e635497	1b1e767c-01e8-470c-a9f3-124b116cfe78	This is my school bag. It is black and blue.	1
dece7499-d981-4b0c-9995-aaa9d8aab349	1b1e767c-01e8-470c-a9f3-124b116cfe78	I have two books, one notebook, three pens, and a small ruler.	2
cea44af5-8823-4a87-8f8b-6a5aa848a9d6	1b1e767c-01e8-470c-a9f3-124b116cfe78	I bring my bag to school every day.	3
7530111b-0664-4fe5-9834-23ec17f353ac	f052f18c-d46d-4c5a-ac03-6ddefbdbad07	It is sunny this morning. The sky is clear and blue.	1
4799722f-203d-495c-aa53-0748f7431979	f052f18c-d46d-4c5a-ac03-6ddefbdbad07	It is hot in the afternoon, so bring a bottle of water.	2
3cbda72e-138f-460c-8e85-30c10b4e3db3	f052f18c-d46d-4c5a-ac03-6ddefbdbad07	In the evening, it may be windy.	3
8e68af4d-8748-4e89-b66f-db5ed50f414f	357c7c32-c4e6-43e5-8280-8d377a6f94c8	Every Saturday morning, Lan visits the market near her house.	1
29a8c0d6-53d2-42f8-a97f-136beef85c0e	357c7c32-c4e6-43e5-8280-8d377a6f94c8	She buys fresh vegetables, eggs, and fruit for her family.	2
dc8b636b-fb9d-485f-b11f-86c9b3825c2f	357c7c32-c4e6-43e5-8280-8d377a6f94c8	Her favorite stall sells mangoes because they are sweet and cheap.	3
d6e19e24-62d9-488b-ad70-48b018bfa1d0	4e681afa-0983-4586-bad2-0f7e55d8dfc8	Tom moved into the apartment next to Nina last week.	1
ae4a2a4d-7f59-48d4-9754-b98515f90e33	4e681afa-0983-4586-bad2-0f7e55d8dfc8	On Sunday, Nina helped him carry two heavy boxes upstairs.	2
a9bea1a7-436e-4d34-a9b2-abeaacbab1df	4e681afa-0983-4586-bad2-0f7e55d8dfc8	Tom thanked her and invited her family for tea.	3
5a0aaa20-ab7a-488f-aae6-c301533f8b13	5c39d961-4038-4326-8204-3790aa5689f2	Water is important, but many families use more than they need.	1
d3b05528-184c-41f1-9ef7-38f0add353ff	5c39d961-4038-4326-8204-3790aa5689f2	You can save water by taking shorter showers and turning off the tap while brushing your teeth.	2
40d0f87f-213c-4f6c-8e0c-34ceb7b39a11	5c39d961-4038-4326-8204-3790aa5689f2	Small habits at home can help protect rivers and lakes.	3
\.


--
-- Data for Name: readingprogress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.readingprogress (userid, lessonid, status, score, updatedat) FROM stdin;
00000000-0000-4000-8000-000000000101	671cda22-546d-4aee-a195-ec5068c0fc48	in_progress	65	2026-07-01 20:00:00+07
00000000-0000-4000-8000-000000000102	671cda22-546d-4aee-a195-ec5068c0fc48	completed	86	2026-07-01 20:05:00+07
00000000-0000-4000-8000-000000000102	1b1e767c-01e8-470c-a9f3-124b116cfe78	in_progress	70	2026-07-01 20:10:00+07
00000000-0000-4000-8000-000000000103	671cda22-546d-4aee-a195-ec5068c0fc48	completed	95	2026-07-01 20:15:00+07
00000000-0000-4000-8000-000000000103	1b1e767c-01e8-470c-a9f3-124b116cfe78	completed	90	2026-07-01 20:20:00+07
\.


--
-- Data for Name: readingquestions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.readingquestions (id, lessonid, questiontype, prompt, optiona, optionb, optionc, optiond, correctanswer, correctboolean, acceptedanswers, explanation, orderindex) FROM stdin;
ce960baf-eccb-4190-a28f-012ee93511c2	873d0162-3e45-4a54-9b86-5bddd9cc54f4	multiple_choice	What is the main idea of the passage?	Breakfast can help students have energy	Students should sleep late	Sweet drinks are the best choice	Lunch is not important	Breakfast can help students have energy	\N		The passage explains why breakfast gives students energy.	0
e54fd0b6-0d91-402c-ba58-827dc892ce9b	873d0162-3e45-4a54-9b86-5bddd9cc54f4	true_false	A healthy breakfast must be complicated.						f		The passage says a healthy breakfast does not need to be complicated.	1
17fb01c1-336a-4d21-a76a-3346c85e05ca	873d0162-3e45-4a54-9b86-5bddd9cc54f4	fill_blank	It is better to drink water or ____ instead of sweet drinks.					milk	\N	milk	The final paragraph mentions water or milk.	2
b3617768-38dc-4d76-9ec7-4f104ff63b66	c32c90c8-1907-40de-b87b-1e55d70cb505	multiple_choice	When is the library closed?	Monday	Friday	Saturday	Sunday	Sunday	\N		The first paragraph says the library is closed on Sundays.	0
8282fd8c-6612-458d-ae43-0d6852f121ee	c32c90c8-1907-40de-b87b-1e55d70cb505	true_false	Visitors can borrow up to five books.						t		The notice says visitors can borrow up to five books with a membership card.	1
e234ae7e-fd52-4e8f-b07e-a1126b76eef1	c32c90c8-1907-40de-b87b-1e55d70cb505	fill_blank	Books must be returned within two ____.					weeks	\N	weeks\nweek	Books must be returned within two weeks.	2
285dd15c-e630-4d7a-863a-a0c176a99e08	873d0162-3e45-4a54-9b86-5bddd9cc54f4	multiple_choice	1	2	3	4	5	6	t		7	0
dc829623-017e-4985-964a-11b74aef961f	2a33464f-ee6a-49e3-bd92-b1de168fe9ed	multiple_choice	What is her name?	Linh	Anna	Ben	Tom	Linh	f			1
7c002cce-6e6b-46d1-ac42-9cb7900eecda	2a33464f-ee6a-49e3-bd92-b1de168fe9ed	true_false	Linh lives in Da Nang.						t			2
fbb6e4ab-6f34-412e-9123-bea435ef2d2d	2a33464f-ee6a-49e3-bd92-b1de168fe9ed	fill_blank	I ____ English every day.					study	f	study		3
174a894d-5276-4402-b5dc-51970db24866	ef44c251-5fbc-48a0-9570-9e492f6d695c	multiple_choice	Where is the book?	On the desk	In the bag	Under the chair	Near the door	On the desk	f			1
4076b4d7-488d-4b92-975d-1f49cb174164	ef44c251-5fbc-48a0-9570-9e492f6d695c	true_false	The pen is in the bag.						t			2
f3bc2d56-6ddd-4de0-87ec-b1c92a72f600	ef44c251-5fbc-48a0-9570-9e492f6d695c	fill_blank	There is a ____ in the classroom.					board	f	board		3
f7a3b606-89bd-4b23-b6ae-593bf267cab0	671cda22-546d-4aee-a195-ec5068c0fc48	multiple_choice	Who does Mai live with?	Her parents and brother	Her aunt	Her teacher	Her friends	Her parents and brother	\N	\N		1
dd0a4b00-7594-4108-a09b-9922dc79ae78	671cda22-546d-4aee-a195-ec5068c0fc48	multiple_choice	What is Mai s mother?	A nurse	A driver	A student	A cook	A nurse	\N	\N		2
a487f95e-3cfb-4346-8ccd-277d0ee3478f	671cda22-546d-4aee-a195-ec5068c0fc48	true_false	Mai has a little brother.	\N	\N	\N	\N	\N	t	\N		3
0ee151b5-1020-4dba-9a2e-1520c51a7f21	1b1e767c-01e8-470c-a9f3-124b116cfe78	multiple_choice	What color is the school bag?	Black and blue	Red and yellow	Green and white	Pink and black	Black and blue	\N	\N		1
2737cb19-0534-499c-8381-fe3c2f470a19	1b1e767c-01e8-470c-a9f3-124b116cfe78	multiple_choice	How many pens are in the bag?	Three	Two	One	Four	Three	\N	\N		2
c8494ad3-1eb0-4c41-b698-adeef8511e78	1b1e767c-01e8-470c-a9f3-124b116cfe78	fill_blank	The student has a small ___.	\N	\N	\N	\N	ruler	\N	ruler		3
82ee6be5-35c3-4bd2-bf48-2fa56d32c178	f052f18c-d46d-4c5a-ac03-6ddefbdbad07	multiple_choice	How is the sky in the morning?	Clear and blue	Dark and rainy	Cloudy and gray	Windy and cold	Clear and blue	\N	\N		1
9ca129e0-220a-4521-a985-afc6317be525	f052f18c-d46d-4c5a-ac03-6ddefbdbad07	multiple_choice	What should you bring?	A bottle of water	A heavy coat	A notebook	An umbrella	A bottle of water	\N	\N		2
ff75d900-a2c7-4e21-98e3-82c255745d93	f052f18c-d46d-4c5a-ac03-6ddefbdbad07	true_false	It may be windy in the evening.	\N	\N	\N	\N	\N	t	\N		3
f2371596-8796-4628-944e-b14f3f3c9c3b	357c7c32-c4e6-43e5-8280-8d377a6f94c8	multiple_choice	When does Lan visit the market?	Saturday morning	Sunday evening	Monday morning	Friday night	Saturday morning	\N	\N		1
4eb948d2-95a0-4dfe-9b8c-16fe25aef916	357c7c32-c4e6-43e5-8280-8d377a6f94c8	multiple_choice	What does her favorite stall sell?	Mangoes	Bread	Fish	Books	Mangoes	\N	\N		2
981110f5-6589-4084-a1bd-13f10077b059	357c7c32-c4e6-43e5-8280-8d377a6f94c8	true_false	The mangoes are expensive.	\N	\N	\N	\N	\N	f	\N		3
0596431a-23d1-4cd2-a48c-f03785236520	4e681afa-0983-4586-bad2-0f7e55d8dfc8	multiple_choice	When did Tom move in?	Last week	Yesterday	Last year	This morning	Last week	\N	\N		1
32d4f617-b773-4435-a913-9e03ebad0775	4e681afa-0983-4586-bad2-0f7e55d8dfc8	multiple_choice	What did Nina help Tom carry?	Two heavy boxes	Three chairs	A small table	A bag of food	Two heavy boxes	\N	\N		2
345b9e06-4930-413e-b21e-a6fade6a1711	4e681afa-0983-4586-bad2-0f7e55d8dfc8	true_false	Tom invited Nina s family for tea.	\N	\N	\N	\N	\N	t	\N		3
10f7b81f-1000-47c7-8e4b-5db83bf6884b	5c39d961-4038-4326-8204-3790aa5689f2	multiple_choice	How can you save water while brushing your teeth?	Turn off the tap	Use hot water	Brush longer	Open the window	Turn off the tap	\N	\N		1
b723a564-b678-4c62-8aea-02ae8e6704fc	5c39d961-4038-4326-8204-3790aa5689f2	multiple_choice	What can small habits protect?	Rivers and lakes	Cars and roads	Books and pens	Phones and computers	Rivers and lakes	\N	\N		2
e3ee776e-b6b2-474d-a5cd-ba73b9ede5ed	5c39d961-4038-4326-8204-3790aa5689f2	true_false	The text says water is not important.	\N	\N	\N	\N	\N	f	\N		3
\.


--
-- Data for Name: readingvocabulary; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.readingvocabulary (id, lessonid, word, meaning, orderindex) FROM stdin;
488001c1-4c03-4e15-8097-d7ba3bff89bb	873d0162-3e45-4a54-9b86-5bddd9cc54f4	healthy	lành mạnh	0
d83e1228-efcc-4ae4-bdd3-6b952be45377	873d0162-3e45-4a54-9b86-5bddd9cc54f4	energy	năng lượng	1
8db6f79c-6a25-46f5-b8cd-83391ee84301	873d0162-3e45-4a54-9b86-5bddd9cc54f4	instead of	thay vì	2
291c574e-7aad-47b2-aea3-ac378b0eb541	873d0162-3e45-4a54-9b86-5bddd9cc54f4	habit	thói quen	3
55e618c4-cd2d-4d27-beab-7771a560d1aa	c32c90c8-1907-40de-b87b-1e55d70cb505	membership card	thẻ thành viên	0
ae3dfd0e-7025-4f98-850a-e4c434ba73c2	c32c90c8-1907-40de-b87b-1e55d70cb505	borrow	mượn	1
24616f0f-a0a5-4061-9415-9235b93ada81	c32c90c8-1907-40de-b87b-1e55d70cb505	return	trả lại	2
59003cc2-e798-43de-baa4-fed5e5ea69b0	c32c90c8-1907-40de-b87b-1e55d70cb505	quiet area	khu vực yên tĩnh	3
5aa570ea-49b4-4564-9cad-b73443a6361a	2a33464f-ee6a-49e3-bd92-b1de168fe9ed	student	học sinh/sinh viên	1
232c488c-8168-4e27-b5f0-90b1dbf4da81	2a33464f-ee6a-49e3-bd92-b1de168fe9ed	live	sống	2
b7eb57e0-2d3d-431c-be45-e3e46ee34240	2a33464f-ee6a-49e3-bd92-b1de168fe9ed	study	học	3
986d5fcf-e74c-4380-bb30-a2a726d025af	ef44c251-5fbc-48a0-9570-9e492f6d695c	board	bảng	1
8114d200-dbf3-4645-adc9-077e3fc1e3f5	ef44c251-5fbc-48a0-9570-9e492f6d695c	desk	bàn học	2
2e5af3c1-d071-42ed-a3b5-401814110bed	ef44c251-5fbc-48a0-9570-9e492f6d695c	chair	ghế	3
c276d8e9-9dd6-45c5-9f53-68ab7a18c2be	671cda22-546d-4aee-a195-ec5068c0fc48	father	bố	1
e28ea7e0-1f28-4d11-b261-db985752d66d	671cda22-546d-4aee-a195-ec5068c0fc48	mother	mẹ	2
65ba6b97-f56a-4c77-ad21-6cdf7474212d	671cda22-546d-4aee-a195-ec5068c0fc48	together	cùng nhau	3
39ce5006-8351-423d-9ae4-a96d16e8aab6	1b1e767c-01e8-470c-a9f3-124b116cfe78	school bag	cặp sách	1
d035da17-20ce-4599-ae20-73949170cf81	1b1e767c-01e8-470c-a9f3-124b116cfe78	ruler	thước kẻ	2
34f5f27e-c024-4d26-96af-2ad48e095232	1b1e767c-01e8-470c-a9f3-124b116cfe78	bring	mang theo	3
aa5bb900-d94e-46cd-8b04-d5c1799521dd	f052f18c-d46d-4c5a-ac03-6ddefbdbad07	sunny	có nắng	1
5ad36e22-bacf-4ce6-8cdd-f6cd61f977a2	f052f18c-d46d-4c5a-ac03-6ddefbdbad07	clear	quang đãng	2
0ac8e0d5-594e-4085-badb-f7eda8fcf65f	f052f18c-d46d-4c5a-ac03-6ddefbdbad07	windy	có gió	3
ad27bab4-5a64-48bd-b2cf-1cb7fe5c57c6	357c7c32-c4e6-43e5-8280-8d377a6f94c8	market	chợ	1
3ffb1279-e5cd-4a33-a5a1-708427b218be	357c7c32-c4e6-43e5-8280-8d377a6f94c8	stall	quầy hàng	2
03b5a856-525b-4049-b37f-25d11e63a582	357c7c32-c4e6-43e5-8280-8d377a6f94c8	cheap	rẻ	3
3a8ab3ec-b9ad-43b1-8bc1-6224553f1bfb	4e681afa-0983-4586-bad2-0f7e55d8dfc8	neighbor	hàng xóm	1
36b7bfe0-1cd4-40ff-a1da-81d2d202c3ea	4e681afa-0983-4586-bad2-0f7e55d8dfc8	carry	mang vác	2
702d07c9-5933-4452-b01f-d6b8b55d68b2	4e681afa-0983-4586-bad2-0f7e55d8dfc8	invite	mời	3
65d11f69-ceda-47ca-bb2a-eeff94772340	5c39d961-4038-4326-8204-3790aa5689f2	tap	vòi nước	1
3e01eddc-87a5-465b-aafd-24ae93e6b67d	5c39d961-4038-4326-8204-3790aa5689f2	habit	thói quen	2
6ee949dd-c89a-4708-ab1e-b3c7086aeb0a	5c39d961-4038-4326-8204-3790aa5689f2	protect	bảo vệ	3
\.


--
-- Data for Name: spacedrepetitionitems; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.spacedrepetitionitems (id, userid, targettype, targetid, easefactor, intervaldays, repetitions, lapses, lastscore, lastquality, lastreviewedat, duedate, lastassignedat, createdat, updatedat, ismastered, masteredat) FROM stdin;
\.


--
-- Data for Name: spacedrepetitionreviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.spacedrepetitionreviews (id, itemid, userid, attemptid, score, quality, previouseasefactor, nexteasefactor, previousintervaldays, nextintervaldays, previousrepetitions, nextrepetitions, reviewedat) FROM stdin;
\.


--
-- Data for Name: speakinglessons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.speakinglessons (id, title, description, orderindex, createdat, isfoundation) FROM stdin;
f7c7bb21-bfad-4d5f-9057-aa493a6a2116	Chào hỏi cơ bản	Các mẫu câu chào hỏi hàng ngày	6	2026-05-11 11:31:32.770487	f
d3c02bda-d397-43f2-8b34-305067ac0b6d	Giới thiệu bản thân	Nói về bản thân và gia đình	7	2026-05-11 11:31:32.785334	f
b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	Tại nhà hàng	Giao tiếp khi đi ăn uống	8	2026-05-11 11:31:32.793291	f
eb5ed411-41ff-4422-bae2-1b551e4cc00e	Hỏi đường	Hỏi và chỉ đường đi	9	2026-05-11 11:31:32.799688	f
401e2660-0deb-41d5-a1d4-21e546fdff31	Mua sắm	Giao tiếp khi đi mua hàng	10	2026-05-11 11:31:32.806681	f
dfee0411-e605-429d-9d10-72e817b57863	Hỏi và trả lời tuổi	Luyện nói câu hỏi tuổi và câu trả lời ngắn.	1	2026-06-18 14:30:58.633595	t
c50957d1-91e7-400e-b72a-57ae7eb05df3	Nói về đồ vật trong lớp	Luyện trả lời đồ vật và màu sắc đơn giản.	2	2026-06-18 14:30:58.633595	t
fdff66ff-ad4b-40c6-990c-162e5cc7b575	Hỏi giờ đơn giản	Luyện nói giờ và hoạt động trong ngày.	3	2026-06-18 14:30:58.633595	t
f089e61e-2174-4e93-aecd-409dab19038b	Chào hỏi cơ bản	Tập nói các câu chào hỏi ngắn và rõ.	4	2026-06-12 09:39:59.112021	t
f9f85101-9879-42e0-be0f-f51d900291f8	Thông tin cá nhân	Tập trả lời tên, tuổi và nơi sống.	5	2026-06-12 09:39:59.141162	t
\.


--
-- Data for Name: speakingprogress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.speakingprogress (userid, lessonid, status, score, updatedat) FROM stdin;
00000000-0000-4000-8000-000000000101	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	in_progress	65	2026-07-01 20:00:00+07
00000000-0000-4000-8000-000000000102	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	completed	86	2026-07-01 20:05:00+07
00000000-0000-4000-8000-000000000102	d3c02bda-d397-43f2-8b34-305067ac0b6d	in_progress	70	2026-07-01 20:10:00+07
00000000-0000-4000-8000-000000000103	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	completed	95	2026-07-01 20:15:00+07
00000000-0000-4000-8000-000000000103	d3c02bda-d397-43f2-8b34-305067ac0b6d	completed	90	2026-07-01 20:20:00+07
\.


--
-- Data for Name: speakingquestions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.speakingquestions (id, lessonid, question, translation, option1, option1vi, option2, option2vi, option3, option3vi, orderindex) FROM stdin;
8df35393-bbaf-4ce7-bf14-9de564db1250	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	How are you doing today?	Hôm nay bạn thế nào?	I am doing well, thank you.	Tôi khỏe, cảm ơn bạn.	Not too bad, how about you?	Không tệ lắm, còn bạn?	I feel great today!	Hôm nay tôi cảm thấy tuyệt!	1
f9b77c4d-e3d7-4df3-b29e-7f8a9c166774	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	What is your name?	Tên của bạn là gì?	My name is John.	Tên tôi là John.	I am Sarah.	Tôi là Sarah.	You can call me Mike.	Bạn có thể gọi tôi là Mike.	2
d093b06e-b3f6-4c7f-aaed-4b838748c4aa	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	Where are you from?	Bạn đến từ đâu?	I am from Vietnam.	Tôi đến từ Việt Nam.	I come from the United States.	Tôi đến từ Mỹ.	I was born in London.	Tôi sinh ra ở London.	3
d916a145-751e-425e-ac48-696f1a512fc9	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	Nice to meet you!	Rất vui được gặp bạn!	Nice to meet you too.	Tôi cũng rất vui được gặp bạn.	Likewise.	Tôi cũng vậy.	It is a pleasure meeting you.	Rất hân hạnh được gặp bạn.	4
7a401828-e416-4f98-bd6b-08758a510826	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	How old are you?	Bạn bao nhiêu tuổi?	I am twenty years old.	Tôi hai mươi tuổi.	I just turned eighteen.	Tôi vừa mới mười tám tuổi.	I am in my mid-twenties.	Tôi khoảng giữa tuổi hai mươi.	5
bf757bb2-9089-4935-a8da-dfc80b1590b6	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	See you later!	Hẹn gặp lại nhé!	See you soon!	Hẹn gặp lại sớm!	Take care!	Bảo trọng nhé!	Goodbye, have a nice day!	Tạm biệt, chúc một ngày tốt lành!	6
a232a2c6-2395-49b3-9e8b-a3f7d152aa81	d3c02bda-d397-43f2-8b34-305067ac0b6d	What are your hobbies?	Sở thích của bạn là gì?	I enjoy cooking and swimming.	Tôi thích nấu ăn và bơi lội.	I like playing video games.	Tôi thích chơi game.	I love listening to music.	Tôi thích nghe nhạc.	5
b987a6c2-a4c4-49d2-a4ad-e80d1a582d10	eb5ed411-41ff-4422-bae2-1b551e4cc00e	Excuse me, how do I get to the train station?	Xin lỗi, làm sao để đến ga tàu?	Go straight and turn left at the traffic light.	Đi thẳng rồi rẽ trái ở đèn giao thông.	It is about ten minutes by walking.	Đi bộ khoảng mười phút.	Take the bus number five.	Đi xe buýt số năm.	1
dda91361-8898-4bef-b471-d70f24cae433	eb5ed411-41ff-4422-bae2-1b551e4cc00e	Is there a pharmacy nearby?	Có nhà thuốc nào gần đây không?	Yes, there is one on the corner.	Có, có một nhà thuốc ở góc đường.	The nearest one is two blocks away.	Nhà thuốc gần nhất cách hai dãy nhà.	I am not sure, you can ask someone else.	Tôi không chắc, bạn hỏi người khác nhé.	2
d5a1f4a9-e87e-4a51-9dc4-1a31eb528f87	eb5ed411-41ff-4422-bae2-1b551e4cc00e	How far is the airport from here?	Sân bay cách đây bao xa?	It is about thirty kilometers.	Khoảng ba mươi ki-lô-mét.	You can get there in forty minutes by taxi.	Bạn có thể đến đó trong bốn mươi phút bằng taxi.	It takes one hour by bus.	Đi xe buýt mất một tiếng.	3
c988f125-ace1-4302-9766-c9a41d40aef3	eb5ed411-41ff-4422-bae2-1b551e4cc00e	Can you show me on the map?	Bạn có thể chỉ trên bản đồ không?	Sure, we are here and you need to go there.	Được, chúng ta đang ở đây và bạn cần đi đến kia.	Let me look it up for you.	Để tôi tìm giúp bạn.	Sorry, I do not have a map.	Xin lỗi, tôi không có bản đồ.	4
58f8e16b-e407-4bb6-b6e9-8ba093c39f14	eb5ed411-41ff-4422-bae2-1b551e4cc00e	Which bus goes to the city center?	Xe buýt nào đi đến trung tâm thành phố?	Bus number seven goes there.	Xe buýt số bảy đi đến đó.	You should take the subway instead.	Bạn nên đi tàu điện ngầm.	Any bus from this stop will take you there.	Bất kỳ xe buýt nào từ trạm này đều đến đó.	5
5f1aed3a-701b-437c-bb60-082a36c4bc4a	b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	What would you like to drink?	Bạn muốn uống gì?	Just water, please.	Cho tôi nước lọc.	I would like a cup of coffee.	Tôi muốn một ly cà phê.	Can I get some orange juice?	Cho tôi nước cam được không?	2
fc4e72af-a9c8-4108-b68e-0aa82597128d	d3c02bda-d397-43f2-8b34-305067ac0b6d	What do you do for a living?	Bạn làm nghề gì?	I am a software engineer.	Tôi là kỹ sư phần mềm.	I work in marketing.	Tôi làm trong lĩnh vực marketing.	I am still a student.	Tôi vẫn còn là sinh viên.	2
793c11cd-42d2-4887-a063-03d95173ac94	401e2660-0deb-41d5-a1d4-21e546fdff31	How much does this cost?	Cái này giá bao nhiêu?	It is twenty dollars.	Nó giá hai mươi đô la.	Let me check the price for you.	Để tôi kiểm tra giá cho bạn.	It is on sale for half price.	Đang giảm giá còn một nửa.	2
7df70a89-c85b-438e-8339-707ea7aeb2a4	dfee0411-e605-429d-9d10-72e817b57863	How old are you?	Bạn bao nhiêu tuổi?	I am twelve years old.	Tôi 12 tuổi.	I am twenty years old.	Tôi 20 tuổi.	I am a student.	Tôi là học sinh.	1
89b61481-0cd9-4426-ac84-ddf3d7815182	dfee0411-e605-429d-9d10-72e817b57863	How old is your brother?	Em trai bạn bao nhiêu tuổi?	He is six years old.	Em ấy 6 tuổi.	She is six years old.	Cô ấy 6 tuổi.	It is six years old.	Nó 6 tuổi.	2
e5ca125d-1617-4e8c-a023-369c3b68934b	dfee0411-e605-429d-9d10-72e817b57863	Are you a student?	Bạn có phải học sinh không?	Yes, I am a student.	Vâng, tôi là học sinh.	No, I am a teacher.	Không, tôi là giáo viên.	Yes, I live here.	Vâng, tôi sống ở đây.	3
5a751b5c-2887-4d10-9e43-755d66c7e8fb	c50957d1-91e7-400e-b72a-57ae7eb05df3	What is this?	Đây là gì?	This is a pencil.	Đây là bút chì.	This is my father.	Đây là bố tôi.	This is sunny.	Trời nắng.	1
0f633d62-bb01-4b97-a0f3-b1a39fe85eee	c50957d1-91e7-400e-b72a-57ae7eb05df3	What color is your book?	Sách của bạn màu gì?	My book is blue.	Sách của tôi màu xanh.	My book is Monday.	Sách của tôi là thứ Hai.	My book is school.	Sách của tôi là trường học.	2
0883c27c-238e-4a0a-8ef0-65fa3507a881	c50957d1-91e7-400e-b72a-57ae7eb05df3	Do you have a notebook?	Bạn có vở ghi không?	Yes, I have a notebook.	Có, tôi có một quyển vở.	No, I am a notebook.	Không, tôi là quyển vở.	Yes, it is raining.	Có, trời đang mưa.	3
1e668aed-e76f-439d-af52-acd2c40fb7d0	fdff66ff-ad4b-40c6-990c-162e5cc7b575	What time is it?	Mấy giờ rồi?	It is seven o clock.	Bảy giờ rồi.	It is my name.	Đó là tên tôi.	It is a book.	Đó là một quyển sách.	1
f334c542-4aa9-4db7-9ca8-d89f4f1f4b73	fdff66ff-ad4b-40c6-990c-162e5cc7b575	When do you go to school?	Khi nào bạn đi học?	I go to school at seven.	Tôi đi học lúc bảy giờ.	I go to school in my bag.	Tôi đi học trong cặp.	I go to school blue.	Tôi đi học màu xanh.	2
9379a832-43f0-4f2c-ba7f-5d5010d74e78	fdff66ff-ad4b-40c6-990c-162e5cc7b575	When do you have dinner?	Khi nào bạn ăn tối?	I have dinner at seven.	Tôi ăn tối lúc bảy giờ.	I have dinner at school bag.	Tôi ăn tối ở cặp sách.	I have dinner very red.	Tôi ăn tối rất đỏ.	3
338fcb41-b324-4bdb-a96e-b4addddbd04b	401e2660-0deb-41d5-a1d4-21e546fdff31	Can I help you find something?	Tôi có thể giúp bạn tìm gì không?	Yes, I am looking for a pair of shoes.	Vâng, tôi đang tìm một đôi giày.	No thanks, I am just browsing.	Không, cảm ơn, tôi chỉ xem thôi.	Do you have this in a smaller size?	Bạn có cái này cỡ nhỏ hơn không?	1
d35edc47-cfb1-41a5-978a-af551ece220b	401e2660-0deb-41d5-a1d4-21e546fdff31	Do you accept credit cards?	Bạn có nhận thẻ tín dụng không?	Yes, we accept all major credit cards.	Vâng, chúng tôi nhận mọi loại thẻ tín dụng.	Sorry, we only accept cash.	Xin lỗi, chúng tôi chỉ nhận tiền mặt.	We also accept mobile payment.	Chúng tôi cũng nhận thanh toán di động.	3
6ee06f80-5fae-4c45-bb57-840a9ef340d4	f089e61e-2174-4e93-aecd-409dab19038b	Hello. What is your name?	Xin chào. Bạn tên là gì?	My name is Linh.	Tên tôi là Linh.	I am a student.	Tôi là học sinh.	I live in Vietnam.	Tôi sống ở Việt Nam.	1
3e83ca98-e058-4e0a-9d61-8b328ddbf9c8	f089e61e-2174-4e93-aecd-409dab19038b	How are you today?	Hôm nay bạn khỏe không?	I am fine, thank you.	Tôi khỏe, cảm ơn.	My name is Nam.	Tên tôi là Nam.	It is a book.	Nó là một quyển sách.	2
369f8d40-406e-4449-97a6-a9b5afb39654	f089e61e-2174-4e93-aecd-409dab19038b	Nice to meet you.	Rất vui được gặp bạn.	Nice to meet you too.	Tôi cũng rất vui được gặp bạn.	I am eighteen.	Tôi mười tám tuổi.	This is my pen.	Đây là bút của tôi.	3
6029d337-7a6b-4702-8a7d-4469ad13eaad	f9f85101-9879-42e0-be0f-f51d900291f8	Where do you live?	Bạn sống ở đâu?	I live in Hanoi.	Tôi sống ở Hà Nội.	I am fine.	Tôi khỏe.	It is on the desk.	Nó ở trên bàn.	1
98dd0911-e67b-497e-a71e-95cc0a1329ed	f9f85101-9879-42e0-be0f-f51d900291f8	How old are you?	Bạn bao nhiêu tuổi?	I am eighteen years old.	Tôi mười tám tuổi.	I like coffee.	Tôi thích cà phê.	My bag is blue.	Cặp của tôi màu xanh.	2
29a87650-3ece-45ee-9ed9-fe85b045bb70	f9f85101-9879-42e0-be0f-f51d900291f8	Are you a student?	Bạn có phải học sinh/sinh viên không?	Yes, I am a student.	Vâng, tôi là học sinh/sinh viên.	I live in Da Nang.	Tôi sống ở Đà Nẵng.	This is my classroom.	Đây là lớp học của tôi.	3
dda01176-249a-4be7-be17-9bc984bdd73b	401e2660-0deb-41d5-a1d4-21e546fdff31	Can I try this on?	Tôi có thể thử cái này không?	Of course, the fitting room is over there.	Tất nhiên, phòng thử đồ ở đằng kia.	Sure, what size do you need?	Được, bạn cần cỡ bao nhiêu?	Yes, there is a mirror inside.	Vâng, bên trong có gương.	4
cbca83da-acc7-45d8-b1d0-42c450c1672a	401e2660-0deb-41d5-a1d4-21e546fdff31	I would like to return this item.	Tôi muốn trả lại món hàng này.	Do you have the receipt?	Bạn có hóa đơn không?	What is the reason for the return?	Lý do trả hàng là gì?	We can exchange it for another one.	Chúng tôi có thể đổi cho bạn cái khác.	5
5923f43b-598b-4866-a52c-8fe3917f03a5	b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	Are you ready to order?	Bạn đã sẵn sàng gọi món chưa?	Yes, I will have the steak.	Vâng, tôi sẽ dùng bò bít tết.	Not yet, I need a few more minutes.	Chưa, cho tôi thêm vài phút.	Can you recommend something?	Bạn có thể gợi ý gì không?	1
cb864b93-21e3-4d41-8a12-03f09adc0565	b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	How is your food?	Thức ăn thế nào?	It is delicious, thank you.	Rất ngon, cảm ơn.	It tastes amazing!	Nó ngon tuyệt vời!	It is a little too salty.	Nó hơi mặn một chút.	3
9eb50a27-4497-4b1d-aa8b-161d98b8b3d8	b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	Would you like some dessert?	Bạn có muốn tráng miệng không?	No thank you, I am full.	Không cảm ơn, tôi no rồi.	Yes, I will have the cheesecake.	Vâng, cho tôi bánh phô mai.	What desserts do you have?	Có những loại tráng miệng nào?	4
9fe12a59-d65b-4f2f-be00-d2bcb61c147b	b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	Can I get the check, please?	Cho tôi xin hóa đơn.	Sure, here is your bill.	Được, đây là hóa đơn của bạn.	Would you like to pay by card?	Bạn muốn thanh toán bằng thẻ không?	Are you paying together or separately?	Bạn thanh toán chung hay riêng?	5
9447a5a9-b62e-4934-950c-a84663561683	d3c02bda-d397-43f2-8b34-305067ac0b6d	Tell me about yourself.	Hãy kể về bạn.	I am a student from Vietnam.	Tôi là sinh viên đến từ Việt Nam.	I work as a teacher.	Tôi làm giáo viên.	I love traveling and reading.	Tôi thích đi du lịch và đọc sách.	1
9d921125-697c-4720-b67c-65282623dbb0	d3c02bda-d397-43f2-8b34-305067ac0b6d	Do you have any brothers or sisters?	Bạn có anh chị em không?	I have one older brother.	Tôi có một anh trai.	I have two younger sisters.	Tôi có hai em gái.	No, I am an only child.	Không, tôi là con một.	3
49ff575a-0687-44cd-9186-7105118a1901	d3c02bda-d397-43f2-8b34-305067ac0b6d	Where do you live?	Bạn sống ở đâu?	I live in Ho Chi Minh City.	Tôi sống ở Thành phố Hồ Chí Minh.	I live in a small town.	Tôi sống ở một thị trấn nhỏ.	I recently moved to Hanoi.	Tôi mới chuyển đến Hà Nội.	4
\.


--
-- Data for Name: studytimedaily; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.studytimedaily (userid, activitydate, activeseconds, updatedat) FROM stdin;
00000000-0000-4000-8000-000000000101	2026-07-01	1260	2026-07-01 21:50:00
00000000-0000-4000-8000-000000000101	2026-07-02	840	2026-07-02 09:30:00
00000000-0000-4000-8000-000000000102	2026-07-01	2280	2026-07-01 21:55:00
00000000-0000-4000-8000-000000000103	2026-07-01	3180	2026-07-01 22:00:00
\.


--
-- Data for Name: supportticketmessages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.supportticketmessages (id, ticketid, senderid, senderrole, message, attachmenturl, attachmentpublicid, attachmentoriginalname, attachmentmimetype, createdat) FROM stdin;
\.


--
-- Data for Name: supporttickets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.supporttickets (id, userid, email, title, description, category, status, attachmenturl, attachmentpublicid, attachmentoriginalname, attachmentmimetype, adminresponse, respondedby, respondedat, createdat, updatedat) FROM stdin;
\.


--
-- Data for Name: usercollections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usercollections (id, userid, name, description, createdat, ispublic, reviewstatus, submittedat, reviewedat, reviewedby, updatedat) FROM stdin;
\.


--
-- Data for Name: usercollectionwords; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usercollectionwords (id, collectionid, customword, custommeaning, customexample, addedat, updatedat) FROM stdin;
\.


--
-- Data for Name: usergameprogress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usergameprogress (id, userid, levelid, score, stars, iscompleted, besttime, attempts, completedat) FROM stdin;
10000000-0000-4000-8000-000000000101	00000000-0000-4000-8000-000000000101	146f267b-a919-48cb-bcb8-bd2b72042a41	72	2	t	54	2	2026-07-01 18:00:00
10000000-0000-4000-8000-000000000102	00000000-0000-4000-8000-000000000102	146f267b-a919-48cb-bcb8-bd2b72042a41	91	3	t	39	2	2026-07-01 18:05:00
10000000-0000-4000-8000-000000000103	00000000-0000-4000-8000-000000000103	146f267b-a919-48cb-bcb8-bd2b72042a41	100	3	t	31	1	2026-07-01 18:10:00
10000000-0000-4000-8000-000000000104	00000000-0000-4000-8000-000000000103	2ef484dc-eba4-4c72-bb6d-93e22387ea22	96	3	t	34	1	2026-07-01 18:15:00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, passwordhash, role, levelid, isactive, createdat, plan, plusexpiresat, avatarurl, onboardingcompleted, placementlevel, placementsource, placementcompletedat) FROM stdin;
00000000-0000-4000-8000-000000000001	admin_primary	admin.primary@system.com	$2a$10$ZHD.AVau1zRXJEdxx9yjyevkrSuCEbX4sZIcsnwbLv3E/nyyLm1Lm	admin	\N	t	2026-07-01 08:00:00+07	free	\N	\N	t	\N	\N	\N
00000000-0000-4000-8000-000000000002	admin	admin@system.com	$2a$10$ZHD.AVau1zRXJEdxx9yjyevkrSuCEbX4sZIcsnwbLv3E/nyyLm1Lm	admin	\N	t	2026-07-01 08:05:00+07	free	\N	\N	t	\N	\N	\N
00000000-0000-4000-8000-000000000101	hocvien_basic	hocvien.basic@example.com	$2a$10$NjUxCvtktULUTQI1SHpSU.nsft8BmFidioixYtLAOakB1djPdMa8u	user	1	t	2026-07-01 09:00:00+07	free	\N	\N	t	new	seed	2026-07-01 09:00:00+07
00000000-0000-4000-8000-000000000102	hocvien_intermediate	hocvien.intermediate@example.com	$2a$10$NjUxCvtktULUTQI1SHpSU.nsft8BmFidioixYtLAOakB1djPdMa8u	user	2	t	2026-07-01 09:05:00+07	free	\N	\N	t	basic	seed	2026-07-01 09:05:00+07
00000000-0000-4000-8000-000000000103	hocvien_advanced	hocvien.advanced@example.com	$2a$10$NjUxCvtktULUTQI1SHpSU.nsft8BmFidioixYtLAOakB1djPdMa8u	user	3	t	2026-07-01 09:10:00+07	free	\N	\N	t	basic	seed	2026-07-01 09:10:00+07
\.


--
-- Data for Name: userstats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.userstats (userid, exp, level, streakdays, lastlogin) FROM stdin;
00000000-0000-4000-8000-000000000001	0	1	0	2026-07-02 08:00:00
00000000-0000-4000-8000-000000000002	0	1	0	2026-07-02 08:05:00
00000000-0000-4000-8000-000000000101	180	2	2	2026-07-02 09:00:00
00000000-0000-4000-8000-000000000102	520	4	5	2026-07-02 09:05:00
00000000-0000-4000-8000-000000000103	960	7	9	2026-07-02 09:10:00
\.


--
-- Data for Name: writingexercises; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.writingexercises (id, lessonid, contentvi, correctansweren, orderindex) FROM stdin;
f13e6609-0bdf-4465-a08e-2b750f9d4394	689823c2-883f-4eec-9dce-f93820865502	Xin chào, tên tôi là Nam và tôi 25 tuổi.	Hello, my name is Nam and I am 25 years old.	1
66cb5b77-e581-4805-8bf2-ab69c96febde	689823c2-883f-4eec-9dce-f93820865502	Tôi đến từ Việt Nam nhưng hiện tại tôi sống ở Nhật Bản.	I am from Vietnam but currently I live in Japan.	2
9891ecb9-561b-459f-9abb-9101cd9785e2	689823c2-883f-4eec-9dce-f93820865502	Tôi là một kỹ sư phần mềm làm việc cho một công ty công nghệ.	I am a software engineer working for a technology company.	3
1dd9d2e0-b53c-4789-9fbb-d8d240f8e5b6	69ea9e12-4230-45a7-ab24-53bf55c1ce99	Vào thời gian rảnh, tôi thích đọc sách và nghe nhạc.	In my free time, I like reading books and listening to music.	1
8aa8733f-c857-48ae-a51d-29806a013ec5	69ea9e12-4230-45a7-ab24-53bf55c1ce99	Sở thích lớn nhất của tôi là đi du lịch và khám phá những vùng đất mới.	My biggest hobby is traveling and exploring new lands.	2
155e3549-df3c-4fa3-9c08-19ad3231dd46	69ea9e12-4230-45a7-ab24-53bf55c1ce99	Tôi thường chơi bóng đá với bạn bè vào mỗi cuối tuần.	I usually play soccer with my friends every weekend.	3
08311049-7dfe-44c3-b19c-1b2404c696bc	601a2a94-3816-46bc-b46e-95b00a6884d5	Kính gửi ông Smith, tôi viết email này để thảo luận về dự án mới.	Dear Mr. Smith, I am writing this email to discuss the new project.	1
9eb0b802-0d96-4b0c-b4ef-a4768f4082df	601a2a94-3816-46bc-b46e-95b00a6884d5	Vui lòng tìm tài liệu đính kèm để biết thêm chi tiết.	Please find the attached document for more details.	2
473802c5-2310-42ab-9ee9-63bbb319d45e	601a2a94-3816-46bc-b46e-95b00a6884d5	Tôi mong sớm nhận được phản hồi từ bạn. Trân trọng.	I look forward to hearing from you soon. Sincerely.	3
505860ef-7ab1-4c07-9909-54c2cf7ad1d7	8328f0ab-21ea-4d75-9358-f32407142a31	Sau đó, tôi ăn sáng với gia đình trước khi đến trường.	After that, I have breakfast with my family before going to school.	2
0211c556-087c-4d41-adb7-59057cce79d5	8328f0ab-21ea-4d75-9358-f32407142a31	Vào buổi chiều, tôi ôn lại bài và làm bài tập cẩn thận.	In the afternoon, I review my lessons and do my homework carefully.	3
eae74c1e-8b5c-4526-9241-625273547fd8	8328f0ab-21ea-4d75-9358-f32407142a31	Vào buổi tối, tôi dành ba mươi phút luyện tiếng Anh trực tuyến.	In the evening, I spend thirty minutes practicing English online.	4
eb2dcaf0-0523-482a-a465-f0665b75e9ab	8328f0ab-21ea-4d75-9358-f32407142a31	Thói quen này giúp tôi khỏe mạnh và học tốt hơn mỗi ngày.	This routine helps me stay healthy and study better every day.	5
ec47499f-c5a0-4392-9f83-efd484dd8668	a1775087-7de6-46f1-89db-012fac05246b	Tháng trước, lớp tôi tham gia một cuộc thi nói tiếng Anh ở trường.	Last month, my class joined an English speaking contest at school.	1
60331d18-7980-40c6-8a93-cb3c89a4933c	a1775087-7de6-46f1-89db-012fac05246b	Lúc đầu, tôi cảm thấy lo lắng vì nhiều học sinh đang xem chúng tôi.	At first, I felt nervous because many students were watching us.	2
42505837-b6ee-4bbd-8c38-f447bf7558f9	a1775087-7de6-46f1-89db-012fac05246b	Bạn bè đã động viên tôi và giúp tôi luyện tập trước phần trình bày.	My friends encouraged me and helped me practice before the performance.	3
517b932f-d5c0-42c7-ae1b-571a8cfa6a88	a1775087-7de6-46f1-89db-012fac05246b	Cuối cùng, nhóm chúng tôi giành giải nhì và mọi người rất vui.	Finally, our group won second prize and everyone was very happy.	4
9154c294-1934-473f-ae45-4d243a675fa2	8328f0ab-21ea-4d75-9358-f32407142a31	Tôi thường thức dậy lúc sáu giờ và uống một ly nước.	I usually wake up at six o’clock and drink a glass of water.	1
a637f40a-4212-4e21-9dc0-9c035f69028c	a1775087-7de6-46f1-89db-012fac05246b	Ngày hôm đó dạy tôi rằng làm việc nhóm có thể khiến những việc khó trở nên dễ hơn.	That day taught me that teamwork can make difficult things easier.	5
cb1cb9fa-0bb0-405f-b5cb-b7c2e6d11c53	ab75ceb9-9e62-4129-9452-20f3452946f8	Tôi là học sinh.	I am a student.	2
defb0521-7b6b-4049-a22f-3d924f6f5fdf	ab75ceb9-9e62-4129-9452-20f3452946f8	Hôm nay tôi vui.	I am happy today.	3
d8701a56-882a-4826-aec2-bf81b65cbaea	7961c6f8-6b1f-4fd5-90ed-f0068fb011b3	Đây là sách của tôi.	This is my book.	1
0f99f0ee-8fc9-4b44-a180-50fd9b0d3679	7961c6f8-6b1f-4fd5-90ed-f0068fb011b3	Bút của tôi màu xanh.	My pen is blue.	2
396beee1-8651-4a4f-8577-414e3cdefb3c	7961c6f8-6b1f-4fd5-90ed-f0068fb011b3	Cặp của tôi ở trên ghế.	My bag is on the chair.	3
49c83240-6e07-48a6-bb49-6cd759196a50	ab75ceb9-9e62-4129-9452-20f3452946f8	Tên tôi là Linh.	linh linh	1
8414c7cc-b41c-4f5e-91f9-4497116791ff	c88f37a2-5449-453f-9228-c7012a37399d	Tôi có một quyển sách.	I have a book.	1
749e2df7-186c-4416-9e97-4089c162e28f	c88f37a2-5449-453f-9228-c7012a37399d	Tôi có hai cây bút.	I have two pens.	2
ba7e5164-6716-4d92-ba0a-208f135e5eba	c88f37a2-5449-453f-9228-c7012a37399d	Tôi có một chiếc cặp nhỏ.	I have a small bag.	3
89fae282-1f49-41cf-ac28-c9aad07d670b	14b9ef31-c1b6-4ccf-ac0d-abba8f5a1c60	Có một cái bàn học.	There is a desk.	1
6c8849fa-547c-4adb-b8ca-5e368446549c	14b9ef31-c1b6-4ccf-ac0d-abba8f5a1c60	Có một cái ghế.	There is a chair.	2
04bd326f-5ef8-480b-8a07-e49d4f3862c0	14b9ef31-c1b6-4ccf-ac0d-abba8f5a1c60	Có một chiếc đồng hồ trên tường.	There is a clock on the wall.	3
4855878f-ab90-4631-bbbc-3bfe05fc5fc9	8ffc261d-7fbd-488f-a916-8de6fe72d6f7	Tôi thức dậy lúc sáu giờ.	I get up at six.	1
84e90375-9389-4765-a794-94e3c2b0d518	8ffc261d-7fbd-488f-a916-8de6fe72d6f7	Tôi đi học lúc bảy giờ.	I go to school at seven.	2
74e2a6a1-3c70-4d90-b9bf-3fe2d44ad268	8ffc261d-7fbd-488f-a916-8de6fe72d6f7	Tôi đi ngủ lúc mười giờ.	I go to bed at ten.	3
\.


--
-- Data for Name: writinglessons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.writinglessons (id, title, description, orderindex, createdat, passageen, passagevi, isfoundation) FROM stdin;
689823c2-883f-4eec-9dce-f93820865502	Giới thiệu bản thân	Viết các câu cơ bản giới thiệu về bản thân	6	2026-05-11 11:31:33.260603			f
69ea9e12-4230-45a7-ab24-53bf55c1ce99	Sở thích cá nhân	Mô tả những điều bạn thích làm	7	2026-05-11 11:31:33.272892			f
601a2a94-3816-46bc-b46e-95b00a6884d5	Email công việc	Các mẫu câu thông dụng trong email	8	2026-05-11 11:31:33.282802			f
8328f0ab-21ea-4d75-9358-f32407142a31	Một ngày thường nhật	Viết đoạn văn ngắn kể về lịch trình mỗi ngày.	9	2026-05-15 09:16:20.269444	I usually wake up at six o’clock and drink a glass of water. After that, I have breakfast with my family before going to school. In the afternoon, I review my lessons and do my homework carefully. In the evening, I spend thirty minutes practicing English online. This routine helps me stay healthy and study better every day.	Tôi thường thức dậy lúc sáu giờ và uống một ly nước. Sau đó, tôi ăn sáng với gia đình trước khi đến trường. Vào buổi chiều, tôi ôn lại bài và làm bài tập cẩn thận. Vào buổi tối, tôi dành ba mươi phút luyện tiếng Anh trực tuyến. Thói quen này giúp tôi khỏe mạnh và học tốt hơn mỗi ngày.	f
14b9ef31-c1b6-4ccf-ac0d-abba8f5a1c60	Viết câu với There is	Luyện viết câu mô tả có một đồ vật.	1	2026-06-18 14:30:58.633595	There is a desk. There is a chair. There is a clock on the wall.	Có một cái bàn học. Có một cái ghế. Có một chiếc đồng hồ trên tường.	t
c88f37a2-5449-453f-9228-c7012a37399d	Viết câu với I have	Luyện viết câu sở hữu rất ngắn.	2	2026-06-18 14:30:58.633595	I have a book. I have two pens. I have a small bag.	Tôi có một quyển sách. Tôi có hai cây bút. Tôi có một chiếc cặp nhỏ.	t
8ffc261d-7fbd-488f-a916-8de6fe72d6f7	Viết câu về thời gian	Luyện viết giờ và hoạt động hằng ngày.	3	2026-06-18 14:30:58.633595	I get up at six. I go to school at seven. I go to bed at ten.	Tôi thức dậy lúc sáu giờ. Tôi đi học lúc bảy giờ. Tôi đi ngủ lúc mười giờ.	t
ab75ceb9-9e62-4129-9452-20f3452946f8	Viết câu với I am	Viết câu giới thiệu bản thân ngắn.	4	2026-06-12 09:39:59.14677	My name is Linh. I am a student. I am happy today.	Tên tôi là Linh. Tôi là học sinh. Hôm nay tôi vui.	t
7961c6f8-6b1f-4fd5-90ed-f0068fb011b3	Viết câu về đồ vật	Viết câu đơn với This is và My.	5	2026-06-12 09:39:59.269116	This is my book. My pen is blue. My bag is on the chair.	Đây là sách của tôi. Bút của tôi màu xanh. Cặp của tôi ở trên ghế.	t
a1775087-7de6-46f1-89db-012fac05246b	Kỷ niệm ở trường	Viết đoạn văn kể về một kỷ niệm đáng nhớ ở trường.	10	2026-05-15 09:16:20.300353	Last month, my class joined an English speaking contest at school. At first, I felt nervous because many students were watching us. My friends encouraged me and helped me practice before the performance. Finally, our group won second prize and everyone was very happy. That day taught me that teamwork can make difficult things easier.	Tháng trước, lớp tôi tham gia một cuộc thi nói tiếng Anh ở trường. Lúc đầu, tôi cảm thấy lo lắng vì nhiều học sinh đang xem chúng tôi. Bạn bè đã động viên tôi và giúp tôi luyện tập trước phần trình bày. Cuối cùng, nhóm chúng tôi giành giải nhì và mọi người rất vui. Ngày hôm đó dạy tôi rằng làm việc nhóm có thể khiến những việc khó trở nên dễ hơn.	f
\.


--
-- Data for Name: writingprogress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.writingprogress (userid, lessonid, status, score, updatedat) FROM stdin;
00000000-0000-4000-8000-000000000101	689823c2-883f-4eec-9dce-f93820865502	in_progress	65	2026-07-01 20:00:00+07
00000000-0000-4000-8000-000000000102	689823c2-883f-4eec-9dce-f93820865502	completed	86	2026-07-01 20:05:00+07
00000000-0000-4000-8000-000000000102	69ea9e12-4230-45a7-ab24-53bf55c1ce99	in_progress	70	2026-07-01 20:10:00+07
00000000-0000-4000-8000-000000000103	689823c2-883f-4eec-9dce-f93820865502	completed	95	2026-07-01 20:15:00+07
00000000-0000-4000-8000-000000000103	69ea9e12-4230-45a7-ab24-53bf55c1ce99	completed	90	2026-07-01 20:20:00+07
\.


--
-- Data for Name: writingvocab; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.writingvocab (id, exerciseid, word, meaning) FROM stdin;
19b3cc6d-8444-4cd9-a670-89ad7ae5584a	66cb5b77-e581-4805-8bf2-ab69c96febde	currently	hiện tại
9c888512-03a9-4f48-8c55-ee16b28b9ef6	9891ecb9-561b-459f-9abb-9101cd9785e2	engineer	kỹ sư
b49f7f3e-dfcc-4d9d-aaae-aa436da9d82c	8aa8733f-c857-48ae-a51d-29806a013ec5	hobby	sở thích
010ef98c-aa6a-4262-ad44-85ab6a7acba9	8aa8733f-c857-48ae-a51d-29806a013ec5	exploring	khám phá
7f8e3d8b-fe7d-4066-96f2-b06c828dbce2	155e3549-df3c-4fa3-9c08-19ad3231dd46	usually	thường xuyên
a4ad2554-2689-4b85-955b-0ea188d2db0e	08311049-7dfe-44c3-b19c-1b2404c696bc	discuss	thảo luận
24536b2c-e326-41f4-8521-4a02e4df1cb7	9eb0b802-0d96-4b0c-b4ef-a4768f4082df	attached	đính kèm
f5ce2182-8554-4dec-92c5-7b185df77a68	9eb0b802-0d96-4b0c-b4ef-a4768f4082df	details	chi tiết
08cdc665-85b9-4d4d-a14d-43e656bb2255	473802c5-2310-42ab-9ee9-63bbb319d45e	look forward to	mong đợi
b13c1b29-0480-4e6a-8460-da1627c09492	473802c5-2310-42ab-9ee9-63bbb319d45e	Sincerely	Trân trọng
9847be70-490e-45f2-bfe2-ab0c729e4726	9154c294-1934-473f-ae45-4d243a675fa2	usually	thường
e95fb320-0987-41d0-a9ac-59d9cbdcf4ea	9154c294-1934-473f-ae45-4d243a675fa2	wake up	thức dậy
efa35830-099a-4c04-9389-6b3ea97c0cc6	505860ef-7ab1-4c07-9909-54c2cf7ad1d7	after that	sau đó
3b2c917d-ffad-49fd-849a-7fccd057051a	505860ef-7ab1-4c07-9909-54c2cf7ad1d7	breakfast	bữa sáng
af735b3a-e4a8-4ce5-a088-89fdacb1c6c9	0211c556-087c-4d41-adb7-59057cce79d5	review	ôn lại
1af01e8d-1c1d-4b34-b8db-3d65eed46129	0211c556-087c-4d41-adb7-59057cce79d5	carefully	cẩn thận
46a85413-f38e-4909-a9b7-3eb4794ea6ad	eae74c1e-8b5c-4526-9241-625273547fd8	spend	dành thời gian
44d68dfa-d295-4fee-950c-f983b6f058d5	eae74c1e-8b5c-4526-9241-625273547fd8	online	trực tuyến
627d3452-140d-47b1-8537-6df48d5599d1	eb2dcaf0-0523-482a-a465-f0665b75e9ab	routine	thói quen
fab48d79-ec40-435b-b6ea-12efc96b39d4	eb2dcaf0-0523-482a-a465-f0665b75e9ab	healthy	khỏe mạnh
c70213cb-6638-4a0b-8733-c4aa10f5b350	ec47499f-c5a0-4392-9f83-efd484dd8668	contest	cuộc thi
5743a9b5-0dda-44a9-8c8f-e97dfdb8ab82	ec47499f-c5a0-4392-9f83-efd484dd8668	joined	tham gia
50ca7ef7-da2f-494c-bbb9-5e7df77edbb2	60331d18-7980-40c6-8a93-cb3c89a4933c	nervous	lo lắng
533e0553-e096-4823-89ba-5912732fe118	60331d18-7980-40c6-8a93-cb3c89a4933c	at first	lúc đầu
7cecc454-8ef4-4a44-9ab2-c5fee6b7397f	42505837-b6ee-4bbd-8c38-f447bf7558f9	encouraged	động viên
122dc962-8699-4900-aad1-28efd1a5bc1b	42505837-b6ee-4bbd-8c38-f447bf7558f9	performance	phần trình bày
70ca493e-11b0-428b-bafe-2c2797571b6c	517b932f-d5c0-42c7-ae1b-571a8cfa6a88	finally	cuối cùng
a0525f15-08d2-4d7f-99f4-05320b1f7a77	517b932f-d5c0-42c7-ae1b-571a8cfa6a88	second prize	giải nhì
3c57dff3-c946-4385-a32e-690b98c7f387	a637f40a-4212-4e21-9dc0-9c035f69028c	teamwork	làm việc nhóm
3145fd8c-32f9-45f7-9053-56c856d2a5b8	a637f40a-4212-4e21-9dc0-9c035f69028c	difficult	khó khăn
a5b28b94-5156-4fd9-80c1-d81902971240	49c83240-6e07-48a6-bb49-6cd759196a50	name	tên
58953d14-b687-48af-bde4-3bc905f76c36	cb1cb9fa-0bb0-405f-b5cb-b7c2e6d11c53	student	học sinh/sinh viên
9ce081b6-54b2-41a5-9757-2e48bad1d180	defb0521-7b6b-4049-a22f-3d924f6f5fdf	happy	vui
8f8ee5e2-0ec0-4d25-b7b3-b0040f42389e	d8701a56-882a-4826-aec2-bf81b65cbaea	book	sách
02418ae8-cb73-471d-9202-8d5d0c5af5b5	0f99f0ee-8fc9-4b44-a180-50fd9b0d3679	blue	màu xanh
4123fe8b-ffdb-4af7-ae13-84ddbf443abb	396beee1-8651-4a4f-8577-414e3cdefb3c	chair	ghế
75e91062-b620-4407-8abb-3f5ce2599855	8414c7cc-b41c-4f5e-91f9-4497116791ff	book	quyển sách
45077797-45d8-4a1e-bf97-146cbf763f73	749e2df7-186c-4416-9e97-4089c162e28f	two	hai
81b5b7af-64d9-4369-9729-75486e9bb988	749e2df7-186c-4416-9e97-4089c162e28f	pens	bút
3be86b36-1a1a-40e2-a351-b8d4bfc6d86a	ba7e5164-6716-4d92-ba0a-208f135e5eba	small	nhỏ
29d7159a-15b6-4318-8ef8-2896e66bc19c	ba7e5164-6716-4d92-ba0a-208f135e5eba	bag	cặp
6cf3637e-6f46-42b3-bdca-f714fd45c9dd	89fae282-1f49-41cf-ac28-c9aad07d670b	desk	bàn học
0ce6966b-ab9c-403f-91cd-f2c73f731822	6c8849fa-547c-4adb-b8ca-5e368446549c	chair	ghế
94213641-e8af-4e60-b3a2-2b8b8de4d000	04bd326f-5ef8-480b-8a07-e49d4f3862c0	clock	đồng hồ
9098f99b-ca9a-4724-acfc-cf0f2921552b	04bd326f-5ef8-480b-8a07-e49d4f3862c0	wall	tường
5fdbc446-204f-4842-b81c-9ef86fc7d69c	4855878f-ab90-4631-bbbc-3bfe05fc5fc9	get up	thức dậy
d59f2569-d96c-4622-a39c-e0f21bf2b934	84e90375-9389-4765-a794-94e3c2b0d518	school	trường học
4a7979f0-23db-481a-8222-6fdc499a1116	74e2a6a1-3c70-4d90-b9bf-3fe2d44ad268	go to bed	đi ngủ
\.


--
-- Name: grammarcategories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.grammarcategories_id_seq', 49, true);


--
-- Name: learninglevels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.learninglevels_id_seq', 3, true);


--
-- Name: dailytasks dailytasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dailytasks
    ADD CONSTRAINT dailytasks_pkey PRIMARY KEY (id);


--
-- Name: gamelevels gamelevels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gamelevels
    ADD CONSTRAINT gamelevels_pkey PRIMARY KEY (id);


--
-- Name: grammarcategories grammarcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grammarcategories
    ADD CONSTRAINT grammarcategories_pkey PRIMARY KEY (id);


--
-- Name: grammarprogress grammarprogress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grammarprogress
    ADD CONSTRAINT grammarprogress_pkey PRIMARY KEY (userid, topicid);


--
-- Name: grammarquiz grammarquiz_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grammarquiz
    ADD CONSTRAINT grammarquiz_pkey PRIMARY KEY (id);


--
-- Name: grammartopics grammartopics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grammartopics
    ADD CONSTRAINT grammartopics_pkey PRIMARY KEY (id);


--
-- Name: learninglevels learninglevels_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learninglevels
    ADD CONSTRAINT learninglevels_code_key UNIQUE (code);


--
-- Name: learninglevels learninglevels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learninglevels
    ADD CONSTRAINT learninglevels_pkey PRIMARY KEY (id);


--
-- Name: listeninglessons listeninglessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeninglessons
    ADD CONSTRAINT listeninglessons_pkey PRIMARY KEY (id);


--
-- Name: listeningprogress listeningprogress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeningprogress
    ADD CONSTRAINT listeningprogress_pkey PRIMARY KEY (userid, lessonid);


--
-- Name: listeningquestions listeningquestions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeningquestions
    ADD CONSTRAINT listeningquestions_pkey PRIMARY KEY (id);


--
-- Name: listeningsegments listeningsegments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeningsegments
    ADD CONSTRAINT listeningsegments_pkey PRIMARY KEY (id);


--
-- Name: listeningspeakers listeningspeakers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeningspeakers
    ADD CONSTRAINT listeningspeakers_pkey PRIMARY KEY (id);


--
-- Name: listeningvocabulary listeningvocabulary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeningvocabulary
    ADD CONSTRAINT listeningvocabulary_pkey PRIMARY KEY (id);


--
-- Name: minigamequestions minigamequestions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.minigamequestions
    ADD CONSTRAINT minigamequestions_pkey PRIMARY KEY (id);


--
-- Name: notificationrecipients notificationrecipients_notificationid_userid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificationrecipients
    ADD CONSTRAINT notificationrecipients_notificationid_userid_key UNIQUE (notificationid, userid);


--
-- Name: notificationrecipients notificationrecipients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificationrecipients
    ADD CONSTRAINT notificationrecipients_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: passwordresetcodes passwordresetcodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passwordresetcodes
    ADD CONSTRAINT passwordresetcodes_pkey PRIMARY KEY (id);


--
-- Name: paymentrequests paymentrequests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paymentrequests
    ADD CONSTRAINT paymentrequests_pkey PRIMARY KEY (id);


--
-- Name: placementminigamequestions placementminigamequestions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placementminigamequestions
    ADD CONSTRAINT placementminigamequestions_pkey PRIMARY KEY (id);


--
-- Name: readinglessons readinglessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readinglessons
    ADD CONSTRAINT readinglessons_pkey PRIMARY KEY (id);


--
-- Name: readingparagraphs readingparagraphs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readingparagraphs
    ADD CONSTRAINT readingparagraphs_pkey PRIMARY KEY (id);


--
-- Name: readingprogress readingprogress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readingprogress
    ADD CONSTRAINT readingprogress_pkey PRIMARY KEY (userid, lessonid);


--
-- Name: readingquestions readingquestions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readingquestions
    ADD CONSTRAINT readingquestions_pkey PRIMARY KEY (id);


--
-- Name: readingvocabulary readingvocabulary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readingvocabulary
    ADD CONSTRAINT readingvocabulary_pkey PRIMARY KEY (id);


--
-- Name: spacedrepetitionitems spacedrepetitionitems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spacedrepetitionitems
    ADD CONSTRAINT spacedrepetitionitems_pkey PRIMARY KEY (id);


--
-- Name: spacedrepetitionitems spacedrepetitionitems_userid_targettype_targetid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spacedrepetitionitems
    ADD CONSTRAINT spacedrepetitionitems_userid_targettype_targetid_key UNIQUE (userid, targettype, targetid);


--
-- Name: spacedrepetitionreviews spacedrepetitionreviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spacedrepetitionreviews
    ADD CONSTRAINT spacedrepetitionreviews_pkey PRIMARY KEY (id);


--
-- Name: spacedrepetitionreviews spacedrepetitionreviews_userid_attemptid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spacedrepetitionreviews
    ADD CONSTRAINT spacedrepetitionreviews_userid_attemptid_key UNIQUE (userid, attemptid);


--
-- Name: speakinglessons speakinglessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.speakinglessons
    ADD CONSTRAINT speakinglessons_pkey PRIMARY KEY (id);


--
-- Name: speakingprogress speakingprogress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.speakingprogress
    ADD CONSTRAINT speakingprogress_pkey PRIMARY KEY (userid, lessonid);


--
-- Name: speakingquestions speakingquestions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.speakingquestions
    ADD CONSTRAINT speakingquestions_pkey PRIMARY KEY (id);


--
-- Name: studytimedaily studytimedaily_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.studytimedaily
    ADD CONSTRAINT studytimedaily_pkey PRIMARY KEY (userid, activitydate);


--
-- Name: supportticketmessages supportticketmessages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supportticketmessages
    ADD CONSTRAINT supportticketmessages_pkey PRIMARY KEY (id);


--
-- Name: supporttickets supporttickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supporttickets
    ADD CONSTRAINT supporttickets_pkey PRIMARY KEY (id);


--
-- Name: usergameprogress uq_ugp_user_level; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usergameprogress
    ADD CONSTRAINT uq_ugp_user_level UNIQUE (userid, levelid);


--
-- Name: usercollections usercollections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usercollections
    ADD CONSTRAINT usercollections_pkey PRIMARY KEY (id);


--
-- Name: usercollectionwords usercollectionwords_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usercollectionwords
    ADD CONSTRAINT usercollectionwords_pkey PRIMARY KEY (id);


--
-- Name: usergameprogress usergameprogress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usergameprogress
    ADD CONSTRAINT usergameprogress_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: userstats userstats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.userstats
    ADD CONSTRAINT userstats_pkey PRIMARY KEY (userid);


--
-- Name: writingexercises writingexercises_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.writingexercises
    ADD CONSTRAINT writingexercises_pkey PRIMARY KEY (id);


--
-- Name: writinglessons writinglessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.writinglessons
    ADD CONSTRAINT writinglessons_pkey PRIMARY KEY (id);


--
-- Name: writingprogress writingprogress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.writingprogress
    ADD CONSTRAINT writingprogress_pkey PRIMARY KEY (userid, lessonid);


--
-- Name: writingvocab writingvocab_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.writingvocab
    ADD CONSTRAINT writingvocab_pkey PRIMARY KEY (id);


--
-- Name: idx_daily_tasks_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_daily_tasks_user_date ON public.dailytasks USING btree (userid, taskdate, orderindex);


--
-- Name: idx_listening_lessons_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listening_lessons_order ON public.listeninglessons USING btree (orderindex);


--
-- Name: idx_listening_questions_lesson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listening_questions_lesson ON public.listeningquestions USING btree (lessonid, orderindex);


--
-- Name: idx_listening_segments_speaker; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listening_segments_speaker ON public.listeningsegments USING btree (speakerid);


--
-- Name: idx_listening_speakers_lesson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listening_speakers_lesson ON public.listeningspeakers USING btree (lessonid, orderindex);


--
-- Name: idx_listening_vocab_lesson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listening_vocab_lesson ON public.listeningvocabulary USING btree (lessonid, orderindex);


--
-- Name: idx_listeningsegments_lesson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listeningsegments_lesson ON public.listeningsegments USING btree (lessonid, orderindex);


--
-- Name: idx_notification_recipients_notification; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_recipients_notification ON public.notificationrecipients USING btree (notificationid);


--
-- Name: idx_notification_recipients_user_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_recipients_user_created ON public.notificationrecipients USING btree (userid, createdat DESC);


--
-- Name: idx_password_reset_email_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_password_reset_email_created ON public.passwordresetcodes USING btree (email, createdat DESC);


--
-- Name: idx_payment_requests_sepay_transaction; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_payment_requests_sepay_transaction ON public.paymentrequests USING btree (sepaytransactionid) WHERE (sepaytransactionid IS NOT NULL);


--
-- Name: idx_payment_requests_transfer_content; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_payment_requests_transfer_content ON public.paymentrequests USING btree (transfercontent);


--
-- Name: idx_placement_minigame_active_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_placement_minigame_active_type ON public.placementminigamequestions USING btree (isactive, questiontype, difficulty);


--
-- Name: idx_reading_lessons_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reading_lessons_order ON public.readinglessons USING btree (orderindex);


--
-- Name: idx_reading_questions_lesson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reading_questions_lesson ON public.readingquestions USING btree (lessonid, orderindex);


--
-- Name: idx_reading_vocab_lesson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reading_vocab_lesson ON public.readingvocabulary USING btree (lessonid, orderindex);


--
-- Name: idx_readingparagraphs_lesson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_readingparagraphs_lesson ON public.readingparagraphs USING btree (lessonid, orderindex);


--
-- Name: idx_sr_items_due; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sr_items_due ON public.spacedrepetitionitems USING btree (userid, duedate, lastassignedat);


--
-- Name: idx_sr_reviews_item; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sr_reviews_item ON public.spacedrepetitionreviews USING btree (itemid, reviewedat DESC);


--
-- Name: idx_support_ticket_messages_ticket_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_support_ticket_messages_ticket_created ON public.supportticketmessages USING btree (ticketid, createdat);


--
-- Name: idx_support_tickets_status_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_support_tickets_status_created ON public.supporttickets USING btree (status, createdat DESC);


--
-- Name: idx_support_tickets_user_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_support_tickets_user_created ON public.supporttickets USING btree (userid, createdat DESC);


--
-- Name: idx_user_collections_public_review; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_collections_public_review ON public.usercollections USING btree (ispublic, reviewstatus, updatedat DESC);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_email ON public.users USING btree (email);


--
-- Name: ix_minigamequestions_level_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_minigamequestions_level_order ON public.minigamequestions USING btree (levelid, orderindex);


--
-- Name: uq_daily_tasks_user_date_order; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_daily_tasks_user_date_order ON public.dailytasks USING btree (userid, taskdate, orderindex);


--
-- Name: uq_gamelevels_levelnumber; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_gamelevels_levelnumber ON public.gamelevels USING btree (levelnumber);


--
-- Name: ux_usergameprogress_user_level; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ux_usergameprogress_user_level ON public.usergameprogress USING btree (userid, levelid);


--
-- Name: dailytasks dailytasks_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dailytasks
    ADD CONSTRAINT dailytasks_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: grammarprogress grammarprogress_topicid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grammarprogress
    ADD CONSTRAINT grammarprogress_topicid_fkey FOREIGN KEY (topicid) REFERENCES public.grammartopics(id) ON DELETE CASCADE;


--
-- Name: grammarprogress grammarprogress_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grammarprogress
    ADD CONSTRAINT grammarprogress_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: grammarquiz grammarquiz_topicid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grammarquiz
    ADD CONSTRAINT grammarquiz_topicid_fkey FOREIGN KEY (topicid) REFERENCES public.grammartopics(id);


--
-- Name: grammartopics grammartopics_categoryid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grammartopics
    ADD CONSTRAINT grammartopics_categoryid_fkey FOREIGN KEY (categoryid) REFERENCES public.grammarcategories(id);


--
-- Name: listeningprogress listeningprogress_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeningprogress
    ADD CONSTRAINT listeningprogress_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.listeninglessons(id) ON DELETE CASCADE;


--
-- Name: listeningprogress listeningprogress_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeningprogress
    ADD CONSTRAINT listeningprogress_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: listeningquestions listeningquestions_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeningquestions
    ADD CONSTRAINT listeningquestions_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.listeninglessons(id) ON DELETE CASCADE;


--
-- Name: listeningsegments listeningsegments_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeningsegments
    ADD CONSTRAINT listeningsegments_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.listeninglessons(id) ON DELETE CASCADE;


--
-- Name: listeningsegments listeningsegments_speakerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeningsegments
    ADD CONSTRAINT listeningsegments_speakerid_fkey FOREIGN KEY (speakerid) REFERENCES public.listeningspeakers(id) ON DELETE RESTRICT;


--
-- Name: listeningspeakers listeningspeakers_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeningspeakers
    ADD CONSTRAINT listeningspeakers_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.listeninglessons(id) ON DELETE CASCADE;


--
-- Name: listeningvocabulary listeningvocabulary_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listeningvocabulary
    ADD CONSTRAINT listeningvocabulary_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.listeninglessons(id) ON DELETE CASCADE;


--
-- Name: minigamequestions minigamequestions_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.minigamequestions
    ADD CONSTRAINT minigamequestions_levelid_fkey FOREIGN KEY (levelid) REFERENCES public.gamelevels(id) ON DELETE CASCADE;


--
-- Name: notificationrecipients notificationrecipients_notificationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificationrecipients
    ADD CONSTRAINT notificationrecipients_notificationid_fkey FOREIGN KEY (notificationid) REFERENCES public.notifications(id) ON DELETE CASCADE;


--
-- Name: notificationrecipients notificationrecipients_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificationrecipients
    ADD CONSTRAINT notificationrecipients_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_createdby_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_createdby_fkey FOREIGN KEY (createdby) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: passwordresetcodes passwordresetcodes_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passwordresetcodes
    ADD CONSTRAINT passwordresetcodes_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: paymentrequests paymentrequests_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paymentrequests
    ADD CONSTRAINT paymentrequests_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: readingparagraphs readingparagraphs_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readingparagraphs
    ADD CONSTRAINT readingparagraphs_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.readinglessons(id) ON DELETE CASCADE;


--
-- Name: readingprogress readingprogress_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readingprogress
    ADD CONSTRAINT readingprogress_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.readinglessons(id) ON DELETE CASCADE;


--
-- Name: readingprogress readingprogress_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readingprogress
    ADD CONSTRAINT readingprogress_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: readingquestions readingquestions_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readingquestions
    ADD CONSTRAINT readingquestions_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.readinglessons(id) ON DELETE CASCADE;


--
-- Name: readingvocabulary readingvocabulary_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readingvocabulary
    ADD CONSTRAINT readingvocabulary_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.readinglessons(id) ON DELETE CASCADE;


--
-- Name: spacedrepetitionitems spacedrepetitionitems_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spacedrepetitionitems
    ADD CONSTRAINT spacedrepetitionitems_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: spacedrepetitionreviews spacedrepetitionreviews_itemid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spacedrepetitionreviews
    ADD CONSTRAINT spacedrepetitionreviews_itemid_fkey FOREIGN KEY (itemid) REFERENCES public.spacedrepetitionitems(id) ON DELETE CASCADE;


--
-- Name: spacedrepetitionreviews spacedrepetitionreviews_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spacedrepetitionreviews
    ADD CONSTRAINT spacedrepetitionreviews_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: speakingprogress speakingprogress_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.speakingprogress
    ADD CONSTRAINT speakingprogress_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.speakinglessons(id) ON DELETE CASCADE;


--
-- Name: speakingprogress speakingprogress_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.speakingprogress
    ADD CONSTRAINT speakingprogress_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: speakingquestions speakingquestions_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.speakingquestions
    ADD CONSTRAINT speakingquestions_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.speakinglessons(id) ON DELETE CASCADE;


--
-- Name: studytimedaily studytimedaily_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.studytimedaily
    ADD CONSTRAINT studytimedaily_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: supportticketmessages supportticketmessages_senderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supportticketmessages
    ADD CONSTRAINT supportticketmessages_senderid_fkey FOREIGN KEY (senderid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: supportticketmessages supportticketmessages_ticketid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supportticketmessages
    ADD CONSTRAINT supportticketmessages_ticketid_fkey FOREIGN KEY (ticketid) REFERENCES public.supporttickets(id) ON DELETE CASCADE;


--
-- Name: supporttickets supporttickets_respondedby_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supporttickets
    ADD CONSTRAINT supporttickets_respondedby_fkey FOREIGN KEY (respondedby) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: supporttickets supporttickets_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supporttickets
    ADD CONSTRAINT supporttickets_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: usercollections usercollections_reviewedby_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usercollections
    ADD CONSTRAINT usercollections_reviewedby_fkey FOREIGN KEY (reviewedby) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: usercollections usercollections_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usercollections
    ADD CONSTRAINT usercollections_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: usercollectionwords usercollectionwords_collectionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usercollectionwords
    ADD CONSTRAINT usercollectionwords_collectionid_fkey FOREIGN KEY (collectionid) REFERENCES public.usercollections(id);


--
-- Name: usergameprogress usergameprogress_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usergameprogress
    ADD CONSTRAINT usergameprogress_levelid_fkey FOREIGN KEY (levelid) REFERENCES public.gamelevels(id) ON DELETE CASCADE;


--
-- Name: usergameprogress usergameprogress_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usergameprogress
    ADD CONSTRAINT usergameprogress_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: users users_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_levelid_fkey FOREIGN KEY (levelid) REFERENCES public.learninglevels(id);


--
-- Name: userstats userstats_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.userstats
    ADD CONSTRAINT userstats_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: writingexercises writingexercises_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.writingexercises
    ADD CONSTRAINT writingexercises_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.writinglessons(id) ON DELETE CASCADE;


--
-- Name: writingprogress writingprogress_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.writingprogress
    ADD CONSTRAINT writingprogress_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.writinglessons(id) ON DELETE CASCADE;


--
-- Name: writingprogress writingprogress_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.writingprogress
    ADD CONSTRAINT writingprogress_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: writingvocab writingvocab_exerciseid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.writingvocab
    ADD CONSTRAINT writingvocab_exerciseid_fkey FOREIGN KEY (exerciseid) REFERENCES public.writingexercises(id) ON DELETE CASCADE;


--
-- Seed accounts:
--   admin.primary@system.com / Admin@123
--   admin@system.com / Admin@123
--   hocvien.basic@example.com / User@123
--   hocvien.intermediate@example.com / User@123
--   hocvien.advanced@example.com / User@123

-- PostgreSQL database dump complete
--

\unrestrict IrQucG3dr8kyR5udjqo4BZcx4mEaPdHvgeRatHohFC15JaHtnPQqpIjQLYSjO5C
