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
    isdeleted boolean DEFAULT false NOT NULL,
    deletedat timestamp with time zone,
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
    orderindex integer DEFAULT 0,
    isdeleted boolean DEFAULT false NOT NULL,
    deletedat timestamp with time zone
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
    orderindex integer DEFAULT 0,
    isdeleted boolean DEFAULT false NOT NULL,
    deletedat timestamp with time zone
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
    isfoundation boolean DEFAULT false,
    isdeleted boolean DEFAULT false NOT NULL,
    deletedat timestamp with time zone
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
    isfoundation boolean DEFAULT false,
    isdeleted boolean DEFAULT false NOT NULL,
    deletedat timestamp with time zone
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
    level character varying(20) DEFAULT ''::character varying,
    duration character varying(50) DEFAULT ''::character varying,
    orderindex integer DEFAULT 0,
    createdat timestamp without time zone DEFAULT now(),
    isfoundation boolean DEFAULT false,
    isdeleted boolean DEFAULT false NOT NULL,
    deletedat timestamp with time zone
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
    updatedat timestamp with time zone DEFAULT now() NOT NULL,
    isdeleted boolean DEFAULT false NOT NULL,
    deletedat timestamp with time zone
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
    isdeleted boolean DEFAULT false NOT NULL,
    deletedat timestamp with time zone,
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
    level character varying(20) DEFAULT ''::character varying,
    duration character varying(50) DEFAULT ''::character varying,
    orderindex integer,
    createdat timestamp without time zone DEFAULT now(),
    passageen text,
    passagevi text,
    isfoundation boolean DEFAULT false,
    isdeleted boolean DEFAULT false NOT NULL,
    deletedat timestamp with time zone
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

COPY public.dailytasks (id, userid, taskdate, skill, targettype, targetid, title, description, status, orderindex, airationale, completedat, createdat, rewardexp, planversion, taskmode, duedate) FROM stdin;
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
42	Modal Verbs	Động từ khuyết thiếu	🔧	6
43	Comparatives & Superlatives	So sánh hơn & So sánh nhất	⚖️	4
45	Articles	Mạo từ	📎	11
46	Prepositions	Giới từ	📍	9
47	Gerunds & Infinitives	Danh động từ & Nguyên mẫu	🔤	7
48	Question Tags	Câu hỏi đuôi	❓	17
49	Subject-Verb Agreement	Sự hòa hợp chủ-vị	🤝	13
39	Conditionals	Câu điều kiện	🔀	18
44	Relative Clauses	Mệnh đề quan hệ	🔗	15
38	Tenses	Các thì trong tiếng Anh	⏰	12
40	Passive Voice	Câu bị động	🔄	20
41	Reported Speech	Câu tường thuật	💬	19
50	Nouns	Danh từ	📚	0
51	Pronouns	Đại từ	👤	1
52	Adjectives	Tính từ	🎨	2
53	Adverbs	Trạng từ	🧭	3
54	Verbs	Động từ	⚙️	5
55	Phrasal Verbs	Cụm động từ	🧩	8
56	Conjunctions	Liên từ	🔗	10
57	Clauses & Phrases	Mệnh đề và cụm từ	🧱	14
60	Word Study	Từ vựng học	🔤	22
\.


--
-- Data for Name: grammarprogress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grammarprogress (userid, topicid, bestscore, lastscore, attempts, status, updatedat) FROM stdin;
\.


--
-- Data for Name: grammarquiz; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grammarquiz (id, topicid, question, optiona, optionb, optionc, optiond, correctanswer, explanation) FROM stdin;
0ac3241c-122c-4171-aed9-92d2ba0ed238	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	The meeting is ___ Monday ___ 9 AM.	in / at	on / at	at / on	on / in	B	Thứ → on. Giờ → at.
413ee182-2e64-4e4f-abf5-5c469ee7cfe3	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	I'll see you ___ Christmas Day.	in	on	at	by	B	Ngày lễ cụ thể (Christmas Day) → on. (Nhưng "at Christmas" khi nói chung)
482c65ea-d6cd-4f82-9336-e31db37e08a5	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	The bus leaves ___ noon.	in	on	at	to	C	At dùng với thời điểm cụ thể như noon.
5f811471-6d07-4d96-b3f3-39904568786e	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	I usually study ___ night.	in	on	at	by	C	Cụm cố định: at night.
7bce347b-8bad-4846-82d3-34687304a257	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	We arrived ___ the airport early.	in	on	at	to	C	At dùng cho địa điểm cụ thể như airport.
874334c2-36d9-4c81-9f48-1afaeaf513ae	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	She was born ___ 1995.	on	in	at	by	B	Năm → in.
908ba7f3-471f-474b-addb-661b3f409cc5	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	There is a picture ___ the wall.	in	on	at	by	B	Trên bề mặt tường → on the wall.
9b001f79-849c-4c41-a3d8-e1fe364a046d	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	My birthday is ___ June.	in	on	at	to	A	In dùng với tháng.
ae499ee7-4c30-4e43-bb6d-21a9fa19339f	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	We have class ___ Monday.	in	on	at	by	B	On dùng với ngày trong tuần.
b6d46f04-62b2-4bd9-9357-5dae447bafb4	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	She was born ___ 2001.	in	on	at	by	A	In dùng với năm.
ba07cd34-0fd3-4e5a-91b9-d602a54bc8aa	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	The keys are ___ the table.	in	on	at	to	B	On dùng khi vật nằm trên bề mặt.
bd698591-e113-4119-ab5f-997911cdb9cc	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	The meeting starts ___ 9 a.m.	in	on	at	by	C	At dùng với giờ cụ thể.
c8c3e4cb-2520-4c96-ba0e-8f171f65203b	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	She lives ___ the third floor.	in	on	at	to	B	On dùng cho tầng.
de370e8a-e480-4c0b-b74c-ac0ad65948cf	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	She arrived ___ the airport ___ 6 PM.	in / on	at / at	on / in	at / in	B	Địa điểm cụ thể → at the airport. Giờ → at 6 PM.
ed687997-dd39-4de5-9a39-bd8d0045a5c9	d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	The children are ___ the park.	in	on	at	by	A	In dùng trong khu vực/không gian.
12ccf64d-d6c6-47e5-94b0-58bf51801c97	e088946a-b0cf-494c-9746-85e1420a95c1	Chọn câu SAI:	If it rains, the grass gets wet.	If you heat ice, it melts.	If she will come, I will be happy.	If I'm late, I'll call you.	C	C sai vì mệnh đề IF không dùng "will". Đúng: "If she comes..."
29a332ba-cead-4c90-84ee-7da5c28843cb	e088946a-b0cf-494c-9746-85e1420a95c1	If people eat too much sugar, they often ___ weight.	gain	will gain	gained	gains	A	Thói quen/kết quả chung dùng loại 0.
2fdc0e0c-1e06-4197-b2d1-5c109447286f	e088946a-b0cf-494c-9746-85e1420a95c1	If I see Tom, I ___ him your message.	give	gave	will give	gives	C	Kết quả tương lai dùng will.
45fccfda-342d-4d9d-bb56-6cbf14cf8b5a	e088946a-b0cf-494c-9746-85e1420a95c1	If you ___ (mix) blue and yellow, you ___ (get) green.	mix / get	mix / will get	will mix / get	mixed / got	A	Sự thật luôn đúng → CĐK loại 0: cả 2 vế dùng HTĐ.
4b610e8f-4703-47ac-b67b-aecfa631a301	e088946a-b0cf-494c-9746-85e1420a95c1	If she ___ hard, she will pass.	studies	will study	studied	study	A	Mệnh đề if loại 1 dùng hiện tại đơn.
538dad3c-3b50-4355-b5ce-8a5be792aba2	e088946a-b0cf-494c-9746-85e1420a95c1	Plants die if they ___ water.	don't get	won't get	didn't get	aren't get	A	Sự thật chung dùng hiện tại đơn ở cả hai mệnh đề.
5ae1a125-14f7-4793-bdaf-d235ae2d460a	e088946a-b0cf-494c-9746-85e1420a95c1	You get tired if you ___ enough.	don't sleep	won't sleep	didn't sleep	aren't sleep	A	Loại 0 diễn tả kết quả thường đúng.
6843da04-54fe-47fa-ac1d-3b348d10eeab	e088946a-b0cf-494c-9746-85e1420a95c1	If you are free tonight, ___ you call me?	do	did	will	are	C	Câu hỏi kết quả trong loại 1 dùng will.
83262b7a-f24c-42e4-a5af-772fd2fa7508	e088946a-b0cf-494c-9746-85e1420a95c1	If you heat water to 100°C, it ___.	will boil	boils	boiled	is boiling	B	Câu ĐK loại 0: cả 2 vế dùng HTĐ. Sự thật hiển nhiên.
88d32530-d546-46e8-b726-4915bd33c3eb	e088946a-b0cf-494c-9746-85e1420a95c1	If he misses the bus, he ___ late.	is	was	will be	be	C	Khả năng thật ở tương lai dùng first conditional.
8de55426-f630-49bf-8fc5-1649deb48ba5	e088946a-b0cf-494c-9746-85e1420a95c1	If water reaches 100°C, it ___.	boil	boils	will boil	boiled	B	Quy luật tự nhiên dùng loại 0.
8eef9935-ed08-460e-b8df-34c27085796c	e088946a-b0cf-494c-9746-85e1420a95c1	If you don't study, you ___ the test.	fail	will fail	failed	are failing	B	CĐK loại 1: mệnh đề chính dùng will + V nguyên thể.
cbeb0473-eb1c-4057-8f09-7e79d4eb9cea	e088946a-b0cf-494c-9746-85e1420a95c1	If it rains tomorrow, we ___ at home.	stay	stayed	will stay	stays	C	Điều kiện loại 1: if + hiện tại đơn, will + V.
d31a0d4e-f006-4795-b0dd-139999612551	e088946a-b0cf-494c-9746-85e1420a95c1	If it ___ tomorrow, we will stay at home.	rains	will rain	rained	is raining	A	CĐK loại 1: mệnh đề If dùng HTĐ, KHÔNG dùng will.
ec13248a-f961-438c-9fc8-716eebb7a84d	e088946a-b0cf-494c-9746-85e1420a95c1	If you heat ice, it ___.	melts	will melt	melted	is melting	A	Sự thật chung dùng điều kiện loại 0.
043da75b-e290-4967-9c2a-05a3f71340b0	90ad11e3-ee89-49c2-a421-0ef502b8744a	She ___ (go) to the cinema last night.	goes	went	has gone	is going	B	"last night" → QKĐ. "go" là V bất quy tắc: go → went → gone.
08a65ac4-51a4-4383-8bfb-2e2ca2b0cc5b	90ad11e3-ee89-49c2-a421-0ef502b8744a	Chọn câu ĐÚNG:	She didn't liked the movie.	Did you went to school?	He doesn't came yesterday.	We didn't know the answer.	D	A: didn't like (bỏ d). B: Did you go (V nguyên thể). C: didn't come. D đúng: didn't know.
0a497fe0-8167-4cf9-a954-57741e9eafb1	90ad11e3-ee89-49c2-a421-0ef502b8744a	Did she ___ the email?	sent	sends	send	sending	C	Sau did, động từ chính về nguyên thể.
11897114-12a2-4fa6-aef3-dc1cf9ecf8f8	90ad11e3-ee89-49c2-a421-0ef502b8744a	We ___ tired after the trip.	was	were	are	be	B	We dùng were.
13744e1e-d714-41b7-8d10-fcef626009fc	90ad11e3-ee89-49c2-a421-0ef502b8744a	My father ___ a new bike when he was young.	buys	bought	buy	buying	B	When he was young là bối cảnh quá khứ.
1adfe54d-1f70-4e46-bc7b-5f07d1b49239	90ad11e3-ee89-49c2-a421-0ef502b8744a	He ___ the window two minutes ago.	opens	opened	is opening	has opened	B	Ago là dấu hiệu quá khứ đơn.
1ce0294f-38d2-474b-af7b-055973ba789d	90ad11e3-ee89-49c2-a421-0ef502b8744a	The meeting ___ at 10 a.m.	begin	began	begun	begins	B	Begin ở quá khứ đơn là began.
201e3bfa-2355-424c-ad33-211f3d7378ef	90ad11e3-ee89-49c2-a421-0ef502b8744a	They ___ at home last night.	was	were	are	be	B	They đi với were trong quá khứ.
534633dd-7ec9-4b9e-adfa-1809187a20ba	90ad11e3-ee89-49c2-a421-0ef502b8744a	She ___ breakfast this morning.	doesn't eat	didn't eat	isn't eating	hasn't eat	B	Phủ định quá khứ dùng didn't + V nguyên thể.
7c111005-85b4-4f81-a176-4a4f3d24f33d	90ad11e3-ee89-49c2-a421-0ef502b8744a	___ you watch the game yesterday?	Do	Did	Are	Have	B	Yesterday dùng quá khứ đơn; câu hỏi dùng did.
aa7350d7-c99c-4340-9bf5-8076a41d58e8	90ad11e3-ee89-49c2-a421-0ef502b8744a	They ___ (buy) a new house two years ago.	buy	buyed	bought	have bought	C	"two years ago" → QKĐ. "buy" là V bất quy tắc: buy → bought → bought.
eaef7ec5-a3cb-4712-aab5-24b3967d3868	90ad11e3-ee89-49c2-a421-0ef502b8744a	___ you ___ (enjoy) the party?	Did / enjoy	Do / enjoy	Have / enjoyed	Were / enjoying	A	QKĐ nghi vấn: Did + S + V nguyên thể?
f1bf27e2-0e1d-4d63-82c5-7ff2726c6380	90ad11e3-ee89-49c2-a421-0ef502b8744a	I ___ my keys yesterday.	lose	lost	loses	am losing	B	Lose là động từ bất quy tắc: lost.
f94c5062-230f-47e2-8a61-1fc232728b0c	90ad11e3-ee89-49c2-a421-0ef502b8744a	We ___ to Da Nang last summer.	go	goes	went	gone	C	Last summer là thời điểm quá khứ đã kết thúc.
fe26f678-e5fa-4ddb-9c61-dd3e2b63c91b	90ad11e3-ee89-49c2-a421-0ef502b8744a	I ___ (not/see) him yesterday.	didn't see	don't see	haven't seen	wasn't seeing	A	"yesterday" → QKĐ. Phủ định: didn't + V nguyên thể (see).
3a1c93bb-4f17-4c00-a0a7-f7eb9c8daafe	898cd0be-8da5-413e-b201-5d622ac826de	If I ___ (know), I would have told you.	know	knew	had known	have known	C	CĐK loại 3: If + had + V3 (had known). Sự việc đã qua → không thể thay đổi.
61fd3952-397b-463c-8579-92e78761ea42	898cd0be-8da5-413e-b201-5d622ac826de	If they ___ harder, they would have won.	try	tried	had tried	have tried	C	CĐK loại 3: mệnh đề If dùng had + V3: "had tried".
64c45bfe-9346-4269-92dc-597cf6092502	898cd0be-8da5-413e-b201-5d622ac826de	She ___ the job if she had prepared better.	gets	got	would get	would have got	D	Would have + V3 cho kết quả quá khứ.
6552c8b2-2f14-461d-a581-7021f093f57b	898cd0be-8da5-413e-b201-5d622ac826de	I would have helped you if you ___ me.	ask	asked	had asked	would ask	C	If + past perfect.
a0775618-357c-4eae-912a-7c41c1bbed48	898cd0be-8da5-413e-b201-5d622ac826de	If I had known, I ___ you.	would call	will call	would have called	called	C	Điều kiện loại 3 dùng would have + V3.
b3e5d3ca-94c0-4973-b38c-022b83a0c2d3	898cd0be-8da5-413e-b201-5d622ac826de	She would have passed if she ___ more.	studied	had studied	studies	would study	B	Mệnh đề if loại 3 dùng had + V3.
ba1d8729-2780-4f22-b497-bee387edf372	898cd0be-8da5-413e-b201-5d622ac826de	I wouldn't have been late if I ___ up earlier.	wake	woke	had woken	would wake	C	CĐK loại 3: If + had + V3. "had woken" up earlier.
bb7b97a9-91e9-4231-a593-cc68c2183553	898cd0be-8da5-413e-b201-5d622ac826de	If he ___ the map, he wouldn't have got lost.	checked	had checked	checks	would check	B	Điều kiện không xảy ra trong quá khứ dùng had checked.
e0ab57e6-8599-4f5f-b4a3-78d7b52a5205	898cd0be-8da5-413e-b201-5d622ac826de	If they had left earlier, they ___ the train.	catch	caught	would catch	would have caught	D	Kết quả giả định trong quá khứ dùng would have caught.
e8b7d7e3-1a88-459f-93dd-39c5554590a0	898cd0be-8da5-413e-b201-5d622ac826de	They would not have missed the flight if they ___ on time.	arrive	arrived	had arrived	would arrive	C	Mệnh đề if loại 3 dùng had arrived.
f2a87070-61de-41f0-bfe4-dc0460e00876	898cd0be-8da5-413e-b201-5d622ac826de	If it hadn't rained, we ___ outside.	played	will play	would play	would have played	D	Kết quả giả định quá khứ dùng would have played.
fb166bc5-ba34-43f7-bde5-2569fd0868ec	898cd0be-8da5-413e-b201-5d622ac826de	If she had left earlier, she ___ the train.	will catch	would catch	would have caught	catches	C	CĐK loại 3: would have + V3 (would have caught).
fbf6f9bd-5da8-48a3-80d3-ac96e10a9d2f	898cd0be-8da5-413e-b201-5d622ac826de	If I had seen the email, I ___ earlier.	reply	replied	would have replied	will reply	C	Email không được thấy trong quá khứ, kết quả giả định dùng would have replied.
fd4f903d-7e6e-4163-ae52-5861340d3c61	898cd0be-8da5-413e-b201-5d622ac826de	We ___ late if the taxi had arrived on time.	weren't	wouldn't be	wouldn't have been	aren't	C	Kết quả ngược quá khứ dùng wouldn't have been.
ff329c69-de29-4c46-afac-27e1b9f6819c	898cd0be-8da5-413e-b201-5d622ac826de	Câu nào diễn tả sự HỐI TIẾC về quá khứ?	If I study, I will pass.	If I were you, I would go.	If I had known, I would have helped.	If it rains, the road gets wet.	C	C là CĐK loại 3: giả định trái với quá khứ, thể hiện sự hối tiếc.
3e5f5b8a-0789-4049-bac5-5ce939a18cf8	f49c9967-880b-49d0-b9ca-7ebe37dd0971	This is ___ best day of my life.	a	an	the	no article	C	So sánh nhất dùng the.
4631f94c-31d7-418a-8616-75338ad842d8	f49c9967-880b-49d0-b9ca-7ebe37dd0971	I like ___ music.	a	an	the	no article	D	Nói chung về music không dùng mạo từ.
4a95e049-d605-4779-b4c8-c3848c4f66fa	f49c9967-880b-49d0-b9ca-7ebe37dd0971	Can you close ___ door?	a	an	the	no article	C	Door đã xác định trong ngữ cảnh.
4dd4b5f7-a8c2-4ff2-bc00-232103177809	f49c9967-880b-49d0-b9ca-7ebe37dd0971	___ water is essential for life.	A	An	The	-	D	DT không đếm được nói chung → không dùng mạo từ (Ø).
569ff1a6-841d-4202-8b2b-bc99b6cd4bcf	f49c9967-880b-49d0-b9ca-7ebe37dd0971	She is ___ honest woman.	a	an	the	-	B	"honest" h câm, âm đầu là nguyên âm /ɒ/ → dùng "an".
58330124-df29-4191-9126-f56b3c08e592	f49c9967-880b-49d0-b9ca-7ebe37dd0971	___ Earth moves around ___ Sun.	A / a	An / the	The / the	- / -	C	Vật duy nhất (chỉ có 1) → the Earth, the Sun.
5f1e9232-74e8-4869-8a8b-388bd0f88010	f49c9967-880b-49d0-b9ca-7ebe37dd0971	I bought ___ new car. ___ car is blue.	a / The	an / The	the / A	a / A	A	Lần đầu nhắc → a. Đã biết → the.
5fb28b7f-0318-4c7f-bb93-58a05cd5aaf3	f49c9967-880b-49d0-b9ca-7ebe37dd0971	He is ___ university student.	a	an	the	-	A	"university" phát âm /juː/ (bắt đầu bằng phụ âm) → dùng "a".
936b8c8e-7131-4670-bc95-a3933410a96c	f49c9967-880b-49d0-b9ca-7ebe37dd0971	I saw ___ elephant at the zoo.	a	an	the	no article	B	Elephant bắt đầu bằng âm nguyên âm nên dùng an.
bb105d03-2fa4-4d3f-82ea-f681bea0fe18	f49c9967-880b-49d0-b9ca-7ebe37dd0971	He is ___ honest man.	a	an	the	no article	B	Honest bắt đầu bằng âm /o/ nên dùng an.
d753db8f-7ccd-46bb-8d12-0b7753f9d5d7	f49c9967-880b-49d0-b9ca-7ebe37dd0971	We stayed at ___ hotel near the airport.	a	an	the	no article	A	Hotel được nhắc lần đầu, dùng a.
e28f2f37-0197-4876-b5c6-ea51359559c2	f49c9967-880b-49d0-b9ca-7ebe37dd0971	She wants to be ___ engineer.	a	an	the	no article	B	Engineer bắt đầu bằng âm nguyên âm nên dùng an.
ece3acc5-b221-4eb4-8ca3-2698a339961f	f49c9967-880b-49d0-b9ca-7ebe37dd0971	___ apples are good for your health.	A	An	The	No article	D	Nói chung về danh từ số nhiều dùng no article.
f2714547-5e1c-4242-a748-edbd833e8d1b	f49c9967-880b-49d0-b9ca-7ebe37dd0971	___ sun rises in the east.	A	An	The	No article	C	Sun là đối tượng duy nhất trong ngữ cảnh.
f5cbe6a2-2de6-464a-9af1-d62d0ba7c281	f49c9967-880b-49d0-b9ca-7ebe37dd0971	She bought ___ new phone yesterday.	a	an	the	no article	A	Nhắc lần đầu một chiếc điện thoại chưa xác định dùng a.
0849a231-0208-45ec-914a-4a6dfe18afca	1390d58f-d902-4d8a-a6cc-e455e66c25e7	Look! The dog ___ across the street.	runs	is running	run	ran	B	Look! dùng với hành động đang xảy ra.
2836c813-cb0a-4007-80a1-4abca3ca6721	1390d58f-d902-4d8a-a6cc-e455e66c25e7	She ___ with her aunt this week.	stays	is staying	stay	stayed	B	This week ở đây diễn tả tình huống tạm thời.
2bb37f8c-9575-417c-bdb1-65eebc8a2b5a	1390d58f-d902-4d8a-a6cc-e455e66c25e7	I ___ the answer.	am knowing	know	knowing	am know	B	Know là stative verb nên thường dùng hiện tại đơn.
38355289-d53f-4990-858d-4d839ed5c5f5	1390d58f-d902-4d8a-a6cc-e455e66c25e7	Chọn câu SAI:	I am loving this song.	She is reading a book.	They are playing tennis.	We are waiting for the bus.	A	"love" là stative verb, không dùng thì tiếp diễn. Phải nói: "I love this song."
4206c548-c19e-4e8e-acf1-15141212cc23	1390d58f-d902-4d8a-a6cc-e455e66c25e7	She ___ (write) an email at the moment.	writes	is writing	write	was writing	B	"at the moment" → HTTD. "write" bỏ e + ing = writing.
54a498b3-dd9b-43e6-928e-dc044fab72da	1390d58f-d902-4d8a-a6cc-e455e66c25e7	What ___ you ___ tonight?	do / do	are / doing	did / do	does / do	B	Kế hoạch gần có thể dùng hiện tại tiếp diễn.
599ba327-1efb-4536-85a0-b59cf18daf80	1390d58f-d902-4d8a-a6cc-e455e66c25e7	I ___ (not/watch) TV right now. I ___ (study).	don't watch / study	am not watching / am studying	not watch / studying	doesn't watch / studies	B	"right now" → HTTD: am not watching / am studying.
5f8018b1-0691-4cae-9d9b-a17779ab5f16	1390d58f-d902-4d8a-a6cc-e455e66c25e7	He ___ a blue shirt today.	wears	is wearing	wear	wore	B	Today diễn tả trạng thái tạm thời trong hiện tại.
7566a2f6-15bf-4fc4-b976-d95d85adea34	1390d58f-d902-4d8a-a6cc-e455e66c25e7	Look! The children ___ in the garden.	play	plays	are playing	played	C	"Look!" là dấu hiệu của HTTD. Hành động đang xảy ra → are + V-ing.
80644fab-53c4-44f3-927c-3a9936a2c83e	1390d58f-d902-4d8a-a6cc-e455e66c25e7	Listen! Someone ___ at the door.	knocks	is knocking	knock	knocked	B	Listen! báo hiệu hành động đang xảy ra.
817a6590-2c87-4b9e-818e-146c427f797a	1390d58f-d902-4d8a-a6cc-e455e66c25e7	We ___ dinner right now.	have	are having	has	had	B	Right now dùng hiện tại tiếp diễn.
cc873ee0-74e7-466f-85af-7096bf6542fd	1390d58f-d902-4d8a-a6cc-e455e66c25e7	We ___ dinner with friends tonight. (Kế hoạch đã lên lịch)	have	has	are having	will have	C	HTTD dùng cho kế hoạch đã sắp xếp trong tương lai gần.
dd48c931-044e-4e79-b35e-3c46a8932226	1390d58f-d902-4d8a-a6cc-e455e66c25e7	They ___ a new bridge in the city.	build	are building	builds	built	B	Hành động đang diễn ra trong giai đoạn hiện tại dùng are building.
e1e02741-59b3-489f-a2b2-b55c24d432f7	1390d58f-d902-4d8a-a6cc-e455e66c25e7	Be quiet! The students ___ a test.	take	are taking	takes	took	B	Be quiet! cho thấy hành động đang diễn ra.
f2325cc5-310c-4539-8da3-64c25de393c0	1390d58f-d902-4d8a-a6cc-e455e66c25e7	Online prices ___ quickly.	change	are changing	changes	changed	B	Xu hướng đang thay đổi dùng hiện tại tiếp diễn.
3c80363d-1a85-4451-9994-14deac0ed234	9e91d53c-79f4-4d39-88b1-e371f22faf60	He has ___ left the office.	yet	ever	just	since	C	Just diễn tả hành động vừa mới xảy ra.
45717157-5b49-4bc6-9e20-58286dd8a3ec	9e91d53c-79f4-4d39-88b1-e371f22faf60	My phone ___ working.	stopped	has stopped	stops	is stopping	B	Kết quả hiện tại là điện thoại không hoạt động, dùng has stopped.
4ebec2ac-c6f4-4d4e-84e5-bdee5721a79c	9e91d53c-79f4-4d39-88b1-e371f22faf60	She ___ already ___ her report.	has / finished	have / finished	had / finished	is / finishing	A	"She" → has. "already" → HTHT. has already finished.
6916baa2-56ff-48c1-a0f8-5c6153f2f07a	9e91d53c-79f4-4d39-88b1-e371f22faf60	Chọn câu ĐÚNG:	I have seen that movie yesterday.	She has worked here for three years.	He have finished his project.	They has already left.	B	A sai (yesterday → QKĐ), C sai (He → has), D sai (They → have). B đúng: has + V3 + for 3 years.
6cf332fc-3666-47ea-99bd-e7386fe2e214	9e91d53c-79f4-4d39-88b1-e371f22faf60	___ you ever ___ to London?	Have / been	Did / go	Have / gone	Were / going	A	"ever" → HTHT. "Have you ever been to...?" là câu hỏi kinh nghiệm chuẩn.
7c7d106c-2aca-4530-8abe-d6e6e35ea4bb	9e91d53c-79f4-4d39-88b1-e371f22faf60	Have you ___ eaten sushi?	never	ever	yet	already	B	Ever dùng trong câu hỏi về trải nghiệm.
83bc4961-dc6d-4961-84df-4677c769c395	9e91d53c-79f4-4d39-88b1-e371f22faf60	She ___ her homework yet.	hasn't finished	didn't finish	isn't finishing	doesn't finish	A	Yet thường dùng trong phủ định/nghi vấn hiện tại hoàn thành.
bf636140-ed9b-4db1-ba8b-cd7dcfd9d836	9e91d53c-79f4-4d39-88b1-e371f22faf60	How long ___ you known him?	do	did	have	are	C	How long với sự việc còn liên quan hiện tại dùng have known.
bf8d7b7b-03b3-4762-9b97-def45868efd0	9e91d53c-79f4-4d39-88b1-e371f22faf60	I ___ (live) in Saigon since 2018.	lived	have lived	am living	was living	B	"since 2018" → HTHT: have/has + V3. Hành động kéo dài từ 2018 đến nay.
cbd26919-cdfd-4e6a-b8d5-d12d4b2eb949	9e91d53c-79f4-4d39-88b1-e371f22faf60	The train ___ already arrived.	is	has	was	does	B	Already thường đi với has/have + V3.
d54ce5d5-05d8-4850-a311-7d65a64e7fd6	9e91d53c-79f4-4d39-88b1-e371f22faf60	She has never ___ to Japan.	be	was	been	being	C	Present perfect dùng have/has + V3.
d9b6f9a0-7439-4989-9354-92a5a4c20fcc	9e91d53c-79f4-4d39-88b1-e371f22faf60	We ___ each other ___ we were children.	knew / when	have known / since	know / for	are knowing / since	B	"since we were children" → HTHT. have known...since = biết nhau từ khi còn nhỏ.
e2ad0b57-9ecf-4a37-9682-83f9855490c3	9e91d53c-79f4-4d39-88b1-e371f22faf60	They ___ here since 2020.	live	lived	have lived	are living	C	Since + mốc thời gian dùng hiện tại hoàn thành.
ec341cde-5112-4c7c-af41-e64b9db584a7	9e91d53c-79f4-4d39-88b1-e371f22faf60	We have studied English ___ five years.	since	for	already	yet	B	For đi với khoảng thời gian.
f9d9925a-2276-4cc8-81cb-7f4f3c0a6885	9e91d53c-79f4-4d39-88b1-e371f22faf60	I ___ this movie before.	see	saw	have seen	am seeing	C	Before nói về trải nghiệm đến hiện tại, dùng have seen.
00669d53-deb4-40dd-bf63-6102424ce53c	22f8f287-7934-484c-86cc-25caa5320092	Don't worry. I ___ you with your bags.	help	will help	am helping	helped	B	Lời hứa/đề nghị → will + V. Quyết định ngay lúc nói.
07347cd9-4011-43ce-8a64-b7e98f366ac0	22f8f287-7934-484c-86cc-25caa5320092	___ she join us for dinner?	Does	Is	Will	Did	C	Câu hỏi tương lai đơn dùng will đứng đầu.
14569707-a8ed-498b-8510-6b6c32cee80d	22f8f287-7934-484c-86cc-25caa5320092	She ___ 25 next month.	is	will be	is being	was	B	Sự kiện trong tương lai → will + be.
16238ceb-3df4-406f-9b38-8ab2b9292952	22f8f287-7934-484c-86cc-25caa5320092	We ___ visit our grandparents this weekend.	are going to	will to	going	do	A	Kế hoạch đã có trước dùng be going to.
211f35e2-2754-4c2c-b171-30b660b6a062	22f8f287-7934-484c-86cc-25caa5320092	They ___ not finish on time.	will	are	do	have	A	Phủ định tương lai đơn: will not + V.
33fc33b2-c1ef-4b1c-8a0b-8dce1dfecf1e	22f8f287-7934-484c-86cc-25caa5320092	The phone is ringing. I ___ answer it.	am going to	will	am	did	B	Quyết định ngay lúc nói dùng will.
681bc745-48ba-4196-b7d4-1ebda7cce611	22f8f287-7934-484c-86cc-25caa5320092	Will you ___ me with this box?	helping	helps	help	helped	C	Sau will dùng động từ nguyên thể.
7804e5c3-aef4-4dc9-a594-420b81524774	22f8f287-7934-484c-86cc-25caa5320092	She ___ call you later.	will	is	does	has	A	Will + động từ nguyên thể.
7b234ea8-c295-4848-8ab4-832514492e0b	22f8f287-7934-484c-86cc-25caa5320092	Look at those dark clouds! It ___ rain.	will	is going to	shall	would	B	Có bằng chứng hiện tại (dark clouds) → dùng "be going to" chứ không phải "will".
a1c9518d-7120-47ac-9645-0363299ebab9	22f8f287-7934-484c-86cc-25caa5320092	Look at those clouds. It ___ rain.	will	is going to	does	was	B	Dự đoán dựa vào dấu hiệu hiện tại dùng be going to.
b94ce6cb-321e-4807-8d0d-195338b16a99	22f8f287-7934-484c-86cc-25caa5320092	He is saving money because he ___ buy a laptop.	will	is going to	does	has	B	Dự định có trước dùng be going to.
cb7a61ac-2591-4473-8c95-282da99d1f11	22f8f287-7934-484c-86cc-25caa5320092	I promise I ___ be late.	won't	don't	am not	didn't	A	Lời hứa dùng will/won't.
d1fc6277-7966-47ff-aaed-6a59a7e335d8	22f8f287-7934-484c-86cc-25caa5320092	I think she ___ the exam.	passes	will pass	is passing	passed	B	"I think" → dự đoán cá nhân → will + V nguyên thể.
d3058822-9e24-481a-b5ae-5afc2cfeb9d7	22f8f287-7934-484c-86cc-25caa5320092	I think it ___ rain tomorrow.	is	will	does	was	B	Dự đoán thường dùng will.
f7c4c93b-80f7-4f45-a37d-114d8212d990	22f8f287-7934-484c-86cc-25caa5320092	___ you ___ the door, please?	Will / close	Do / close	Are / closing	Did / close	A	Yêu cầu lịch sự → Will you + V nguyên thể?
2407e559-603f-4b03-91b8-fcf0ed7e597b	ae1a29d5-7711-46ff-bfed-f66c51979174	You ___ drive without a license. It's against the law.	shouldn't	mustn't	don't have to	can't	B	Cấm (luật pháp) → mustn't. "shouldn't" chỉ là lời khuyên, "mustn't" là cấm.
273906e4-2900-4dc2-9677-1a1c068c753d	ae1a29d5-7711-46ff-bfed-f66c51979174	We ___ be quiet in the library.	should	might	can	would	A	Should phù hợp với lời khuyên/quy tắc lịch sự.
30faf047-71f8-48fd-9842-71b46204adfc	ae1a29d5-7711-46ff-bfed-f66c51979174	It's Sunday. I ___ go to work today.	mustn't	don't have to	shouldn't	can't	B	= Không cần đi làm (vì Chủ nhật). don't have to = không cần.
5d4f34f7-0bb3-4f88-b571-9014192d65a1	ae1a29d5-7711-46ff-bfed-f66c51979174	He ___ be at home. The lights are off.	must	can	might	should	C	Might diễn tả khả năng không chắc chắn.
5fd4ee9c-4b20-4169-8b71-a9f4919c7c15	ae1a29d5-7711-46ff-bfed-f66c51979174	She ___ be at home. Her car is in the driveway.	must	should	can	might	A	Suy đoán chắc chắn (có bằng chứng: xe đỗ ở đó) → must.
61670d89-f3ed-4e7a-872a-076a3e633f91	ae1a29d5-7711-46ff-bfed-f66c51979174	You ___ see a doctor if you feel worse.	can	should	mustn't	may	B	Should dùng cho lời khuyên.
61eb3bc0-4d79-4479-adad-597f4f4f083e	ae1a29d5-7711-46ff-bfed-f66c51979174	She ___ speak three languages.	can	must	should	may	A	Can diễn tả khả năng.
82fc387e-5516-4696-bd8f-f1ba5255b373	ae1a29d5-7711-46ff-bfed-f66c51979174	You look sick. You ___ see a doctor.	must	should	can	might	B	Lời khuyên → should. Không bắt buộc nhưng nên làm.
834c206e-8f47-41a7-85b3-1854bd59ba21	ae1a29d5-7711-46ff-bfed-f66c51979174	Could you ___ the window?	open	to open	opening	opened	A	Sau modal dùng động từ nguyên thể không to.
86f457f5-f7c7-4346-9a9a-827602952479	ae1a29d5-7711-46ff-bfed-f66c51979174	You ___ wear a helmet on a motorbike.	can	must	might	would	B	Must diễn tả bắt buộc mạnh.
984f6667-5465-4e32-ad55-c496a6aa9597	ae1a29d5-7711-46ff-bfed-f66c51979174	It ___ rain later, so take an umbrella.	should	might	must	can't	B	Might dùng cho khả năng.
9c55d75a-a4b0-4f7b-a2a9-450c548174b5	ae1a29d5-7711-46ff-bfed-f66c51979174	___ I use your phone, please?	Must	Should	May	Will	C	Xin phép lịch sự → May I...?
9fed95c8-ff1a-4442-8512-1d427cdd4e99	ae1a29d5-7711-46ff-bfed-f66c51979174	You ___ finish it today; tomorrow is fine.	must	mustn't	don't have to	can't	C	Don't have to nghĩa là không cần thiết.
ac96605b-9f49-4281-a4d9-3f170526a961	ae1a29d5-7711-46ff-bfed-f66c51979174	You ___ smoke in this room.	can	should	mustn't	may	C	Mustn't diễn tả điều bị cấm.
e64bd9bc-abfa-42a9-a5b2-0bd3cd673059	ae1a29d5-7711-46ff-bfed-f66c51979174	Students ___ use phones during the exam.	mustn't	don't have to	may	could	A	Mustn't là cấm.
26799ff4-e316-447a-bb0d-ef293f99e4c0	165b74f8-2224-4556-bf9a-8f3aadea49fd	She is as ___ as her mother.	beautiful	more beautiful	most beautiful	beautifuler	A	So sánh bằng: as + adj (nguyên thể) + as.
2d8f704f-bbac-42f5-83fa-3a197322dc19	165b74f8-2224-4556-bf9a-8f3aadea49fd	This is ___ movie I've ever seen.	the most exciting	more exciting	excitingest	most exciting	A	"exciting" (3 âm tiết) → the most + adj. Phải có "the" trước.
2da2d9c7-75a8-4d04-848a-cd04d342bac9	165b74f8-2224-4556-bf9a-8f3aadea49fd	Today is ___ than yesterday.	hot	hotter	hottest	more hot	B	Hot nhân đôi t rồi thêm -er.
40d0ab50-b29d-4e0c-bbef-5d5977499889	165b74f8-2224-4556-bf9a-8f3aadea49fd	This is the ___ movie I have ever seen.	bad	worse	worst	more bad	C	Bad -> worse -> worst.
642db246-bdc2-4cd5-9e7a-cc47be1588b8	165b74f8-2224-4556-bf9a-8f3aadea49fd	My bag is ___ than yours.	heavy	heavier	heaviest	more heavy	B	Heavy đổi y thành i rồi thêm -er.
6e5256e8-b339-4e77-9394-a04c4b29faa1	165b74f8-2224-4556-bf9a-8f3aadea49fd	He runs ___ than me.	faster	more fast	fastest	more faster	A	"fast" (1 âm tiết) → faster. Không dùng "more fast".
6f1b2f9a-00d2-4f99-909d-1f74549135a8	165b74f8-2224-4556-bf9a-8f3aadea49fd	He runs ___ than his brother.	fast	faster	fastest	more fast	B	Tính từ/trạng từ ngắn fast thêm -er.
75cc52fc-14ac-4305-98a6-c637a0cd0af2	165b74f8-2224-4556-bf9a-8f3aadea49fd	She is ___ than her sister.	more tall	taller	tallest	most tall	B	"tall" (1 âm tiết) → thêm -er: taller + than.
87a8fc4f-a431-4be9-9e84-2f24866782bc	165b74f8-2224-4556-bf9a-8f3aadea49fd	Her answer is ___ than mine.	clear	clearer	clearest	most clear	B	Clear có thể dùng clearer trong so sánh hơn.
9d54d1fb-d51b-40ba-b710-c37048550bd0	165b74f8-2224-4556-bf9a-8f3aadea49fd	The Nile is one of the ___ rivers in the world.	long	longer	longest	more long	C	One of the + superlative + danh từ số nhiều.
a9f36295-cbd7-4b0e-b055-944ee5079300	165b74f8-2224-4556-bf9a-8f3aadea49fd	This exercise is ___ difficult than the last one.	most	more	much	very	B	So sánh hơn với tính từ dài dùng more.
b0582302-9d4f-4bd9-812b-ab6452ca874d	165b74f8-2224-4556-bf9a-8f3aadea49fd	My English is getting ___ and ___.	good / good	better / better	gooder / gooder	best / best	B	Cấu trúc "more and more" / "adj-er and adj-er": better and better.
b438a129-1300-4c8c-9b36-0dd8f3e54027	165b74f8-2224-4556-bf9a-8f3aadea49fd	Mount Everest is the ___ mountain in the world.	high	higher	highest	more high	C	So sánh nhất dùng the highest.
c0071061-c0a7-4a7a-844d-e3f2b53e30a3	165b74f8-2224-4556-bf9a-8f3aadea49fd	She is the ___ student in class.	good	better	best	well	C	So sánh nhất bất quy tắc: good -> best.
e0668a26-7416-4d27-8c43-d5d6f8ddeecd	165b74f8-2224-4556-bf9a-8f3aadea49fd	This book is ___ than that one.	interesting	more interesting	most interesting	interestinger	B	Tính từ dài dùng more + adjective.
0cab65e3-baa9-4537-b70c-c38115374686	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	Cats ___ milk.	likes	like	are liking	liked	B	Cats là danh từ số nhiều nên động từ giữ nguyên.
0f6b53ca-77e5-4506-8080-59d2c675e217	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	My sister ___ (study) English every evening.	studys	studies	study	studying	B	"study" kết thúc bằng phụ âm + y → bỏ y, thêm -ies: "studies".
10a25a19-ea63-4fa1-a6cb-e64cdf8190cf	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	Where ___ your parents work?	do	does	are	is	A	Your parents là số nhiều nên dùng do.
14ca37fe-7612-48f2-b0ab-2611d96a794a	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	The museum ___ at 9 a.m. every day.	open	opens	is opening	opened	B	Lịch trình cố định dùng hiện tại đơn, museum số ít nên opens.
290bdc02-72c2-4bf7-96dd-1036e1928e6d	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	Water ___ at 100 degrees Celsius.	boil	boils	boiling	is boiling	B	"Water" là ngôi 3 số ít, diễn tả sự thật hiển nhiên → dùng HTĐ, V thêm -s.
4f743bc0-5fb7-410a-b23c-b8f88cba0385	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	My teacher ___ three languages.	speak	speaks	speaking	is speak	B	Teacher số ít nên speak thêm -s.
6369c5e1-d145-4587-aa8d-40ccade47266	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	He ___ have a car.	don't	doesn't	isn't	aren't	B	He dùng doesn't + động từ nguyên thể.
78d7c127-b315-4772-95b6-1505bb17d74d	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	I ___ coffee after 8 p.m.	does not drink	do not drink	am not drink	not drink	B	Với I dùng do not + động từ nguyên thể.
91788483-c271-4f29-99fb-011d554ca138	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	My brother ___ football on Sundays.	play	plays	is playing	played	B	My brother là ngôi 3 số ít nên động từ thêm -s.
93ac3773-985d-4470-bef9-30e35a565a27	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	She ___ to school every day.	goes	go	going	gone	A	Chủ ngữ "She" là ngôi 3 số ít → động từ thêm -es. "go" → "goes".
a911ed40-5452-4421-9a84-ba6ba038ed54	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	___ they live near the school?	Does	Are	Do	Is	C	They dùng trợ động từ do trong câu hỏi hiện tại đơn.
bd0e2afe-5204-4ee5-846a-cad28d146c19	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	They never ___ late for class.	arrives	arrive	arriving	are arrive	B	"They" là ngôi thứ 3 số nhiều → V giữ nguyên, không thêm s.
c364b49b-8140-4d89-99a9-2c8a58b55bac	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	She rarely ___ fast food.	eat	eats	eating	ate	B	Rarely là trạng từ tần suất; she dùng eats.
de7e8b71-9c7a-47bb-95b9-e5e56a9fcb99	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	___ your father ___ coffee in the morning?	Do / drinks	Does / drink	Does / drinks	Is / drinking	B	Ngôi 3 số ít dùng "Does" + V nguyên thể (không thêm s). "Does ăn hết chữ S".
f578c088-1996-4e7d-97a7-b42144303fa9	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	The sun ___ in the east.	rise	rises	is rising	rose	B	Sự thật hiển nhiên dùng hiện tại đơn.
00920889-c308-4f9a-b86d-45b2792ef352	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	What ___ you ___ if you won the lottery?	will / do	would / do	do / do	did / do	B	"won" (V2) → CĐK loại 2 → would + V. "What would you do?"
0f56b779-25f8-44be-8567-7782328cc9be	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If I ___ rich, I would travel the world.	am	were	will be	be	B	Giả định hiện tại dùng were.
13831966-1578-4cc2-a317-0449a4b9ce60	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If she didn't live far away, we ___ her more often.	visit	visited	would visit	will visit	C	Điều kiện không thật ở hiện tại dùng would + V.
3a904e95-2b8d-4557-827d-4ac44ae73c90	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If he ___ more money, he ___ a new car.	has / will buy	had / would buy	have / would buy	had / will buy	B	CĐK loại 2: If + V2 (had), would + V (buy).
3d3ef6c8-e83a-4c5d-b43c-50d19b3fc4d8	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If I were you, I ___ apologize.	will	would	do	am	B	If I were you là cấu trúc lời khuyên giả định.
5aea7eb2-17a1-4a3d-9fd2-216e5b0c85a1	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If I ___ speak French, I would work in Paris.	can	could	will	am able	B	Could dùng như dạng quá khứ giả định của can.
681fcdf7-3abe-4750-a0e6-ba6d45bb2a3a	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	What would you do if you ___ a wallet?	find	found	will find	are finding	B	Tình huống giả định dùng past simple.
77b9aedf-e209-487c-8ddc-d8c5af2d88e9	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	She would buy a house if she ___ enough money.	has	had	will have	have	B	If + past simple trong điều kiện loại 2.
7f4c07cf-d00f-4ec3-bc91-782feeb023d9	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If he studied harder, he ___ better results.	gets	got	would get	will get	C	Mệnh đề chính dùng would + V.
8842ee9a-9e15-404d-be25-4cb9ce75508d	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	They ___ happier if they had more free time.	are	will be	would be	were	C	Kết quả giả định dùng would be.
8deefc0b-1539-46f0-8539-3e5129f172a4	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If we had a car, we ___ to the beach.	drive	drove	would drive	will drive	C	Kết quả giả định dùng would drive.
8f4aaaf6-53ad-475d-bcb3-73c0a0128d78	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	He would exercise more if he ___ busy.	isn't	wasn't	weren't	won't be	C	Văn phong chuẩn thường dùng weren't cho giả định.
c341e084-7980-4ee1-8f1d-3f25a743bcb0	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If I ___ a bird, I would fly to the moon.	am	was	were	be	C	CĐK loại 2: to be → "were" cho tất cả các ngôi, kể cả "I".
c4d5d11b-f5bd-4c72-b49b-f6415b80ee83	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	Câu nào diễn tả điều KHÔNG CÓ THẬT ở hiện tại?	If it rains, I will stay home.	If I had a car, I would drive to work.	If you study, you will pass.	If you heat ice, it melts.	B	B là CĐK loại 2: giả định không có thật. Thực tế: Tôi KHÔNG có xe.
c92d1573-bb03-4ae9-bcfb-5aa3bb0923fa	72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	If I were you, I ___ that job offer.	will accept	would accept	accept	accepted	B	"If I were you" → CĐK loại 2 → would + V nguyên thể.
1e880ce9-6d6d-4e15-a973-880ef5a5ba8c	8242916c-9535-4e55-893c-7d1338de5ea1	She said, "I like tea." -> She said that she ___ tea.	likes	liked	has liked	will like	B	Present simple lùi thành past simple.
24b15cc5-f0f9-475a-9afb-8bd8f9d8d9b6	8242916c-9535-4e55-893c-7d1338de5ea1	"Please sit down," he said. -> He asked me ___ down.	sit	to sit	sat	sitting	B	Lời yêu cầu: asked + object + to V.
33d0ab91-0573-4f46-987d-e0eeab01b94e	8242916c-9535-4e55-893c-7d1338de5ea1	Today usually changes to ___ in reported speech.	that day	this day	the next day	yesterday	A	Today đổi thành that day khi tường thuật.
3b6feb49-cb55-4021-91d4-92f60b55fe94	8242916c-9535-4e55-893c-7d1338de5ea1	He said, "I am tired." -> He said that he ___ tired.	is	was	were	be	B	Am lùi thì thành was.
4845afb4-2c73-4325-a276-6f83e32e02df	8242916c-9535-4e55-893c-7d1338de5ea1	She asked, "Are you ready?" -> She asked if I ___ ready.	am	was	were	be	B	Yes/no question dùng if/whether và lùi thì.
48cf50ed-1d16-457b-bbb5-3ba75ea5a5c3	8242916c-9535-4e55-893c-7d1338de5ea1	He asked me, "Where do you live?" -> He asked me where I ___.	do live	did live	lived	am living	C	Câu hỏi gián tiếp dùng trật tự câu kể.
5c05f074-bd1e-4f18-8a20-b2f5e251ea24	8242916c-9535-4e55-893c-7d1338de5ea1	Here usually changes to ___ in reported speech.	there	then	that	this	A	Here thường đổi thành there.
713b7379-9a8f-4c13-8804-f7ec2cab703a	8242916c-9535-4e55-893c-7d1338de5ea1	"I am a teacher." → She said she ___ a teacher.	is	was	were	be	B	Lùi thì: am → was.
95fd7bce-a1f3-491c-9594-047b745a58a1	8242916c-9535-4e55-893c-7d1338de5ea1	"I will call you," Tom said. -> Tom said he ___ call me.	will	would	can	did	B	Will lùi thành would.
9704190d-7d8c-4f10-9001-8f78ca0056b3	8242916c-9535-4e55-893c-7d1338de5ea1	"Don't be late," she said. -> She told me ___ late.	don't be	not be	not to be	to not	C	Mệnh lệnh phủ định: told + object + not to V.
af655a37-08b2-4d5f-937b-5882adad6b61	8242916c-9535-4e55-893c-7d1338de5ea1	"Where is the bank?" → She asked ___.	where is the bank	where the bank is	where was the bank	where the bank was	D	Câu hỏi gián tiếp: đảo lại trật tự S+V và lùi thì: is → was.
c3c2d165-d74c-415a-afa1-8290b056d9b7	8242916c-9535-4e55-893c-7d1338de5ea1	"Don't open the window." → He told me ___ the window.	don't open	not to open	to not open	not opening	B	Mệnh lệnh phủ định → told sb NOT TO + V.
c58ab4d1-6408-4c69-9de8-0aae62fa445e	8242916c-9535-4e55-893c-7d1338de5ea1	He said, "I have finished." -> He said he ___ finished.	has	had	was	would	B	Present perfect lùi thành past perfect.
d2976f1f-5d43-437d-b5d4-3719c647d009	8242916c-9535-4e55-893c-7d1338de5ea1	"Do you speak English?" → She asked me ___ I ___ English.	if / spoke	that / speak	do / speak	if / will speak	A	Câu hỏi Yes/No → asked if/whether + S + V (lùi thì).
e956fb39-6577-4e45-940a-3339103b0878	8242916c-9535-4e55-893c-7d1338de5ea1	"I will call you." → He said he ___ call me.	will	would	can	should	B	Lùi thì: will → would.
084d814e-9773-4cf6-a331-e780b81273c9	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	English ___ in many countries.	speaks	is spoken	spoke	is speaking	B	English là đối tượng được nói, dùng bị động.
0a97b873-c4b4-4ce2-8732-da90d6e68188	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	This book ___ by millions of people.	reads	is read	is reading	has reading	B	Bị động HTĐ: is/are + V3. "read" → V3 = "read" (phát âm /red/). is read.
1877ed79-386e-4509-a082-bf956ab5b06d	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	All the cookies ___ (eat) by the children.	have been eaten	has been eaten	was eaten	are eating	A	"All the cookies" số nhiều → have been + V3 (eaten). HTHT bị động.
1cb474f4-72c4-4ac9-b9ef-f3d4fc082c0b	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The cake ___ by my mother yesterday.	made	was made	is made	makes	B	Bị động quá khứ đơn: was/were + V3.
23874cc2-b28c-47a9-b976-992225b6d8ec	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The problem can ___ solved easily.	be	is	being	been	A	Sau modal trong bị động dùng be + V3.
2911ee2e-7f5e-40b7-af10-8a97c068f3ba	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The room ___ every day.	cleans	is cleaned	cleaned	is cleaning	B	Bị động hiện tại đơn: am/is/are + V3.
667f8fe2-d1f3-45cd-9047-87f3bf88a27e	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The letters ___ already ___.	have / sent	have been / sent	are / send	were / send	B	Bị động hiện tại hoàn thành: have/has been + V3.
7dfe305f-ac08-44e4-bb5f-0f53fe63eec3	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	A new hospital ___ (build) in our city now.	is built	is being built	was built	has been built	B	"now" → HTTD bị động: is/are + being + V3 = is being built.
924a9cc1-ddc3-4b8d-92d5-53ebe8eafcf2	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	A new school ___ next year.	builds	will build	will be built	built	C	School được xây, dùng bị động tương lai.
a26a52ba-9faa-4452-bee1-b47ebd7d9f49	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The car ___ repaired now.	is being	has	was	will	A	Now + bị động tiếp diễn: is being repaired.
a6a14b27-631d-4423-8c59-ef40e1f27636	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	Romeo and Juliet ___ by Shakespeare.	wrote	was written	is writing	were written	B	Tên tác phẩm số ít, dùng was written.
c8c93d24-173c-40e8-857a-f0b6dc150990	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	This report ___ by tomorrow.	must finish	must be finished	must be finish	must finished	B	Modal + bị động: must + be + V3 = "must be finished".
d6f9d8cc-ff8e-48a2-a56c-ea7bf71fdd02	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The house ___ (build) in 1990.	built	was built	is built	has been built	B	Bị động QKĐ: was/were + V3. "in 1990" → quá khứ → was built.
e525d5d1-12c5-4118-90a0-cd17cfd8360e	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	This report ___ by Friday.	will finish	will be finished	finished	is finishing	B	Bị động tương lai: will be + V3.
f16b207e-249b-41d8-91f6-ec7204ed1e8b	a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	The windows ___ right now.	are cleaning	clean	are being cleaned	were cleaned	C	Bị động hiện tại tiếp diễn: am/is/are being + V3.
0a1c556a-13dc-4f4e-80e0-17e1de87e27e	f826100c-a5d5-4963-8f8e-8023cb2024f8	The book ___ you gave me was very interesting.	who	which	whose	where	B	Thay cho vật (tân ngữ) → which/that.
0abaa2b8-bbc4-465a-b997-9af8e1e1e119	f826100c-a5d5-4963-8f8e-8023cb2024f8	I still remember the day ___ I graduated.	which	where	when	whose	C	Thời gian → when (= on which).
0feb61ef-e9ab-4e10-acad-c96194d5982f	f826100c-a5d5-4963-8f8e-8023cb2024f8	The teacher ___ teaches math is very kind.	which	who	where	when	B	Đại từ quan hệ là chủ ngữ chỉ người nên dùng who.
23a95955-9915-4fce-bca9-f90815e94c67	f826100c-a5d5-4963-8f8e-8023cb2024f8	The girl ___ bag was stolen is crying.	who	which	whose	where	C	Whose chỉ sở hữu.
319d0745-8646-4a03-8bd9-dc78e974318e	f826100c-a5d5-4963-8f8e-8023cb2024f8	I remember the day ___ we first met.	where	when	who	which	B	When dùng cho thời gian.
35c1e650-1dbd-43a5-8c33-ba7730ddec18	f826100c-a5d5-4963-8f8e-8023cb2024f8	The man ___ lives next door is a doctor.	which	who	where	when	B	Who dùng cho người.
568c6dc5-eddf-4e42-84d3-6ef0ea5415f4	f826100c-a5d5-4963-8f8e-8023cb2024f8	The boy ___ you met yesterday is my cousin.	who	which	where	when	A	Who dùng cho người làm tân ngữ.
6e3814e9-fe9c-46a4-b7db-66bcd9191033	f826100c-a5d5-4963-8f8e-8023cb2024f8	The laptop ___ is on the desk is mine.	who	which	where	whose	B	Which làm chủ ngữ chỉ vật.
7a1d2be6-87ef-4827-88f8-a4d2a23267a6	f826100c-a5d5-4963-8f8e-8023cb2024f8	The movie ___ we watched was exciting.	who	which	where	whose	B	Which dùng cho vật/sự việc.
9111bea9-0cc5-4a64-92ad-9933cc3c3fea	f826100c-a5d5-4963-8f8e-8023cb2024f8	That is the house ___ my grandparents live.	who	which	where	whose	C	Where thay cho in which chỉ nơi ở.
9cc0407b-67f0-4645-b982-8c05af26dbea	f826100c-a5d5-4963-8f8e-8023cb2024f8	The woman ___ lives next door is a teacher.	which	who	whose	where	B	Thay cho người (chủ ngữ) → who.
a53eead5-5bf6-43b5-b5b1-522fba0fbad4	f826100c-a5d5-4963-8f8e-8023cb2024f8	The man ___ car was stolen called the police.	who	which	whose	that	C	"car was stolen" = xe CỦA ai → sở hữu → whose.
da3f701e-3509-4fa1-885f-21a831ba57c0	f826100c-a5d5-4963-8f8e-8023cb2024f8	The cafe ___ we met is closed now.	where	who	which	whose	A	Where dùng cho nơi chốn.
f092a634-03b6-4a9e-ba36-3ff5af904fe8	f826100c-a5d5-4963-8f8e-8023cb2024f8	This is the book ___ I bought yesterday.	who	where	which	when	C	Which dùng cho vật.
f140cfb2-edcd-42e3-9166-a709ee3ff20c	f826100c-a5d5-4963-8f8e-8023cb2024f8	That is the restaurant ___ we had dinner last night.	which	who	where	whose	C	Nơi chốn → where (= at which).
08c79d44-6f3c-4092-b5e9-51c6d017d165	4f518c44-9b4d-42a4-bade-5b9350334d0f	I avoid ___ late at night.	drive	to drive	driving	drove	C	Avoid theo sau bởi V-ing.
2ce58f35-b74f-4713-b533-c97b47b11dc5	4f518c44-9b4d-42a4-bade-5b9350334d0f	He is interested in ___ English.	learn	to learn	learning	learned	C	Sau giới từ in dùng V-ing.
4f6b64be-5ef6-4e58-abad-1cebeb26beae	4f518c44-9b4d-42a4-bade-5b9350334d0f	She went to the shop ___ some milk.	buy	to buy	buying	bought	B	To + V diễn tả mục đích.
561a9abb-470d-461c-80cc-aceeee8552de	4f518c44-9b4d-42a4-bade-5b9350334d0f	We hope ___ you soon.	see	to see	seeing	saw	B	Hope theo sau bởi to + V.
65f7ba2c-77f2-41c7-9c9b-a8febb65791c	4f518c44-9b4d-42a4-bade-5b9350334d0f	They want ___ a new car.	buy	to buy	buying	bought	B	Want theo sau bởi to + V.
68c9bbea-3856-42b3-8b8a-5a7ddeabaf8b	4f518c44-9b4d-42a4-bade-5b9350334d0f	She enjoys ___ (cook) Italian food.	cook	to cook	cooking	cooked	C	enjoy + V-ing. "enjoys cooking".
8c79b34d-86b8-487c-96c5-8df458b81eb6	4f518c44-9b4d-42a4-bade-5b9350334d0f	I need ___ this report today.	finish	to finish	finishing	finished	B	Need theo sau bởi to + V khi chủ ngữ là người cần làm việc.
8efd7ce6-8fd5-4417-862e-a63a5f75d45c	4f518c44-9b4d-42a4-bade-5b9350334d0f	Don't forget ___ (bring) your passport tomorrow.	bringing	to bring	bring	brought	B	forget + to V = quên phải làm gì (chưa làm). "Don't forget to bring".
903c5d03-8b57-4b8c-860e-c8d574b7a112	4f518c44-9b4d-42a4-bade-5b9350334d0f	I decided ___ (change) my job.	changing	to change	change	changed	B	decide + to V. "decided to change".
9089339d-79ea-4246-a581-d5e099346731	4f518c44-9b4d-42a4-bade-5b9350334d0f	He stopped ___ because he was tired.	work	to work	working	worked	C	Stop + V-ing nghĩa là dừng hành động đang làm.
c82f5291-62d7-429d-b7dc-38ed3cb0cb57	4f518c44-9b4d-42a4-bade-5b9350334d0f	She suggested ___ a break.	take	to take	taking	took	C	Suggest theo sau bởi V-ing.
d290878f-2e73-4778-acea-5b3c7de22093	4f518c44-9b4d-42a4-bade-5b9350334d0f	She decided ___ abroad.	study	to study	studying	studied	B	Decide theo sau bởi to + V.
ef2d83f0-76df-42f7-86fd-79c5b5c0de4b	4f518c44-9b4d-42a4-bade-5b9350334d0f	She is interested ___ (learn) Japanese.	to learn	learning	in learning	for learning	C	interested IN + V-ing. "interested in learning".
f6b480b3-cade-4afb-8273-a7b4cd6bc609	4f518c44-9b4d-42a4-bade-5b9350334d0f	I enjoy ___ books.	read	to read	reading	reads	C	Enjoy theo sau bởi V-ing.
f8e886f3-3379-415c-8743-6580f9476d6b	4f518c44-9b4d-42a4-bade-5b9350334d0f	He stopped ___ (smoke). Now he is healthier.	to smoke	smoking	smoke	smoked	B	stop + V-ing = dừng hẳn việc hút thuốc. "stopped smoking".
066c3a84-fea9-4e9e-babf-262a672acd7c	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	Let's go, ___?	will we	shall we	do we	are we	B	Let's dùng tag shall we.
0c3e1d0d-d105-4005-bf30-11a8cbe41860	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	Open the door, ___?	do you	will you	are you	can you	B	Câu mệnh lệnh thường dùng will you ở question tag.
1c73eacf-6eac-4c2c-9419-b2656ff061c1	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	They went to Paris, ___?	didn't they	did they	don't they	weren't they	A	QKĐ khẳng định (went) → đuôi phủ định: didn't they.
3ef9c31b-c770-4cc3-bebd-e211a9add4b0	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	She has finished, ___?	has she	hasn't she	does she	did she	B	Present perfect dùng has/have trong question tag.
4f78ce82-856c-4f08-9399-7ea78554ac97	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	They went home, ___?	did they	didn't they	do they	don't they	B	Past simple khẳng định dùng didn't ở đuôi.
522f3cfa-ed76-4221-8b2a-6d2a5c25632e	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	He can swim, ___?	can he	can't he	does he	doesn't he	B	Dùng lại modal can ở đuôi.
8fd6bb97-5e2a-4fe8-a6e5-4d94689ff249	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	Nobody called, ___?	didn't they	did they	didn't he	don't they	B	"Nobody" = phủ định → đuôi khẳng định: did they.
96a7f7e1-0ca0-4152-94b3-9e34f81643e1	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	She is a doctor, ___?	isn't she	is she	doesn't she	does she	A	Khẳng định (is) → đuôi phủ định: isn't she.
9a8d32fb-1c43-4f92-8757-4b850df69e4f	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	Let's go to the cinema, ___?	don't we	do we	shall we	will we	C	Trường hợp đặc biệt: Let's → shall we.
a61770c0-d370-47ec-a957-4805029cb2a8	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	You can't drive, ___?	can't you	can you	do you	don't you	B	Phủ định (can't) → đuôi khẳng định: can you.
c7f50ea0-ce61-4e6a-b8bd-b0cb9badcfa3	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	I am late, ___?	am I	aren't I	don't I	isn't I	B	Trường hợp đặc biệt: I am -> aren't I.
edd2e548-89ad-482c-b978-09cbf5fa34c9	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	You are a student, ___?	are you	aren't you	do you	don't you	B	Mệnh đề chính khẳng định với are, đuôi phủ định là aren't you.
f22e2f9d-7ad8-4efc-aa1f-78a95625363e	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	There is a bank near here, ___?	is there	isn't there	does there	doesn't there	B	There is dùng tag isn't there.
f97f1184-d07a-4ac3-83f1-3d643378326b	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	She doesn't like coffee, ___?	does she	doesn't she	is she	isn't she	A	Mệnh đề phủ định thì đuôi khẳng định.
fe5a0aee-2ed8-4600-b73f-f08be71fb8ee	fbbe5a1b-05da-4dfc-adf6-54d1234f026e	Don't be noisy, ___?	do you	will you	are you	don't you	B	Câu mệnh lệnh thường dùng will you.
4247192f-00ff-45ac-9eaa-3d061cdae998	1a03369b-236d-4c49-b873-04d19962f01a	The news ___ surprising.	are	is	were	be	B	News là danh từ số ít về mặt ngữ pháp.
48cc82b0-f820-41bf-8ff7-4f7de82cae02	1a03369b-236d-4c49-b873-04d19962f01a	The number of students ___ increasing.	are	is	were	be	B	The number of là chủ ngữ số ít.
5039517f-2b5a-4321-914f-6b9f5a7a8ccc	1a03369b-236d-4c49-b873-04d19962f01a	Neither she nor her friends ___ coming to the party.	is	are	was	has	B	Neither...nor → chia theo CN gần nhất: "friends" (số nhiều) → are.
574440ce-54d4-4793-8630-3d9daadf5173	1a03369b-236d-4c49-b873-04d19962f01a	There ___ two chairs in the room.	is	are	was	be	B	Động từ hòa hợp với two chairs.
69783f67-03cc-482f-8788-dd0e865d4a5c	1a03369b-236d-4c49-b873-04d19962f01a	Everyone ___ ready for the exam.	is	are	were	have	A	Everyone → luôn đi với V số ít → is.
69ed68b4-f3e8-4787-aef0-cf1ae19ce148	1a03369b-236d-4c49-b873-04d19962f01a	The news ___ very surprising.	is	are	were	have been	A	"news" tuy có -s nhưng là DT không đếm được → V số ít: is.
6d6f33b9-1732-46f3-965d-6ddac13fe587	1a03369b-236d-4c49-b873-04d19962f01a	A number of employees ___ absent today.	is	are	was	has	B	"A number of + N" → số nhiều → are. (≠ "The number of" → số ít)
7728e412-514d-431c-947b-cf4bfdf7664b	1a03369b-236d-4c49-b873-04d19962f01a	Each student ___ a book.	have	has	are having	were	B	Each đi với động từ số ít.
7be201c6-9949-47f6-8f15-95943c52d0a8	1a03369b-236d-4c49-b873-04d19962f01a	The number of students in this class ___ 35.	is	are	were	have	A	"The number of..." → một con số cụ thể → số ít → is.
922d8a4c-00e2-4398-9688-a9d3dbb32c81	1a03369b-236d-4c49-b873-04d19962f01a	My friends and I ___ ready.	am	is	are	be	C	Chủ ngữ ghép với and thường là số nhiều.
afd9f307-2ae0-4c17-8516-02de3bd043a3	1a03369b-236d-4c49-b873-04d19962f01a	Either Tom or his brothers ___ coming.	is	are	was	be	B	Với either...or, động từ thường hòa hợp với chủ ngữ gần nhất.
cd1b7a43-2fb1-47da-9df8-5ef9792f501e	1a03369b-236d-4c49-b873-04d19962f01a	Neither answer ___ correct.	are	is	were	be	B	Neither thường đi với động từ số ít.
f13062e8-3a5f-4ec4-bb6b-48ad311418b1	1a03369b-236d-4c49-b873-04d19962f01a	Everyone ___ to join the club.	want	wants	are wanting	were wanting	B	Everyone là đại từ bất định số ít.
f13b600b-fd89-4564-9555-f2c0fc581ecc	1a03369b-236d-4c49-b873-04d19962f01a	A number of students ___ absent.	is	are	was	be	B	A number of + danh từ số nhiều dùng động từ số nhiều.
fbd1d02d-215b-460f-a4aa-e3d1b6022817	1a03369b-236d-4c49-b873-04d19962f01a	The list of items ___ on the desk.	are	is	were	be	B	Chủ ngữ thật là list, số ít.
0b99dab8-9ad8-5c5e-8909-2e46554f446d	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In the sentence 'My brother, a doctor, lives abroad,' the phrase 'a doctor' serves what function?	Tân ngữ trực tiếp (Direct object)	Bổ ngữ của chủ ngữ (Subjective complement)	Danh từ bổ sung (Appositive phrases)	Chủ ngữ (Subject)	D	'A doctor' là cụm danh từ bổ sung cho 'my brother', làm rõ nghĩa hơn.
1cf8a3d4-0f35-5502-a8bf-b5266621e718	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In 'The dog chased the ball,' what is the function of 'the ball'?	Chủ ngữ (Subject)	Bổ ngữ của chủ ngữ (Subjective complement)	Tân ngữ trực tiếp (Direct object)	Tân ngữ gián tiếp (Indirect object)	C	'The ball' là tân ngữ trực tiếp của động từ 'chased'.
36dc011a-8752-5bcd-aa80-bc06f8a770e6	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In 'He listened to music,' what does 'music' function as?	Tân ngữ gián tiếp (Indirect object)	Tân ngữ của giới từ (Object of a preposition)	Chủ ngữ (Subject)	Bổ ngữ của chủ ngữ (Subjective complement)	C	'Music' là tân ngữ của giới từ 'to'.
39da543d-8b21-5e98-9cc9-047489825808	03aa13a7-c603-5363-9bad-fc8589bcc4b3	Identify the function of the noun in 'The book on the shelf is interesting.'	Chủ ngữ (Subject)	Tân ngữ của giới từ (Object of a preposition)	Bổ ngữ của chủ ngữ (Subjective complement)	Tân ngữ trực tiếp (Direct object)	A	'The book on the shelf' là chủ ngữ của câu, thực hiện hành động 'is interesting'.
4b3b11c6-2ba7-5fee-bd3c-9576f8df6ba6	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In 'Tom is happy,' what function does 'happy' serve?	Bổ ngữ của chủ ngữ (Subjective complement)	Chủ ngữ (Subject)	Bổ ngữ của tân ngữ (Objective complement)	Tân ngữ trực tiếp (Direct object)	A	'Happy' là bổ ngữ của chủ ngữ 'Tom', mô tả trạng thái của anh ấy.
50f03592-ced1-51ae-bfd9-84aa44020c3f	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In 'He is fond of basketball,' what role does 'basketball' play?	Tân ngữ trực tiếp (Direct object)	Bổ ngữ của chủ ngữ (Subjective complement)	Tân ngữ của giới từ (Object of a preposition)	Chủ ngữ (Subject)	C	'Basketball' là tân ngữ của giới từ 'of'.
6dfc587f-f3c2-5e67-976f-128c3a8cd406	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In the sentence 'She gave her friend a gift,' what function does 'a gift' serve?	Chủ ngữ (Subject)	Tân ngữ trực tiếp (Direct object)	Bổ ngữ của tân ngữ (Objective complement)	Bổ ngữ của chủ ngữ (Subjective complement)	B	'A gift' là tân ngữ trực tiếp vì nó nhận hành động 'gave'.
8d4c9c69-0c2e-53fe-aeb2-cfc787818e43	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In 'They elected her president of the club,' what function does 'president' serve?	Bổ ngữ của chủ ngữ (Subjective complement)	Bổ ngữ của tân ngữ (Objective complement)	Chủ ngữ (Subject)	Tân ngữ gián tiếp (Indirect object)	B	'President' là bổ ngữ của tân ngữ 'her', mô tả thêm vị trí của cô ấy.
9766f38b-f670-50b1-9969-bf53f2aff014	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In 'They sought advice from the expert,' 'the expert' serves what function?	Bổ ngữ của tân ngữ (Objective complement)	Bổ ngữ của chủ ngữ (Subjective complement)	Chủ ngữ (Subject)	Tân ngữ của giới từ (Object of a preposition)	D	'The expert' là tân ngữ của giới từ 'from'.
a12fb6e1-a2f7-5531-94b6-93556f7c1ea2	03aa13a7-c603-5363-9bad-fc8589bcc4b3	What function does 'the weather' have in 'The weather is nice today'?	Chủ ngữ (Subject)	Bổ ngữ của tân ngữ (Objective complement)	Tân ngữ trực tiếp (Direct object)	Tân ngữ gián tiếp (Indirect object)	A	'The weather' là chủ ngữ của câu, thực hiện hành động 'is nice'.
ab7e766b-bb22-5db3-982a-c70ae3eed9a2	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In the sentence 'The teacher considers John a good student,' what role does 'a good student' play?	Chủ ngữ (Subject)	Bổ ngữ của chủ ngữ (Subjective complement)	Bổ ngữ của tân ngữ (Objective complement)	Tân ngữ gián tiếp (Indirect object)	D	'A good student' là bổ ngữ của tân ngữ 'John', mô tả thêm về 'John'.
b3d6686a-a81a-5e6f-b778-7b9cbf9cc8ee	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In the sentence 'The children play in the park,' what function does 'The children' serve?	Chủ ngữ (Subject)	Tân ngữ trực tiếp (Direct object)	Tân ngữ gián tiếp (Indirect object)	Bổ ngữ của tân ngữ (Objective complement)	A	'The children' là chủ ngữ của câu, thực hiện hành động chơi.
dc4ebd93-8b8a-5704-8dee-ecff5f9ce6a7	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In 'He named his cat Whiskers,' what role does 'Whiskers' play?	Bổ ngữ của chủ ngữ (Subjective complement)	Chủ ngữ (Subject)	Tân ngữ gián tiếp (Indirect object)	Bổ ngữ của tân ngữ (Objective complement)	C	'Whiskers' là bổ ngữ của tân ngữ 'his cat', cung cấp thêm thông tin về nó.
dc625279-25eb-5595-843f-8504e32bd4b5	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In 'Sarah bought a new car,' what function does 'a new car' serve?	Chủ ngữ (Subject)	Tân ngữ trực tiếp (Direct object)	Bổ ngữ của chủ ngữ (Subjective complement)	Tân ngữ gián tiếp (Indirect object)	B	'A new car' là tân ngữ trực tiếp, nhận hành động 'bought'.
f3a7b64e-5376-599e-8557-7fff53c214d9	03aa13a7-c603-5363-9bad-fc8589bcc4b3	In the sentence 'Mom made me a cake,' what role does 'me' play?	Tân ngữ gián tiếp (Indirect object)	Tân ngữ trực tiếp (Direct object)	Bổ ngữ của chủ ngữ (Subjective complement)	Chủ ngữ (Subject)	B	'Me' là tân ngữ gián tiếp, nhận hành động 'made'.
01e13d5e-8661-55af-bdda-3b1f0144ded9	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	Which of the following is a proper noun?	city	book	teacher	Paris	D	Danh từ riêng là tên của những cá thể duy nhất, ví dụ như 'Paris'.
0bdf3320-a9bc-5b6e-bff7-42200bc90180	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	Which term is a simple noun?	homework	car	bookstore	motherland	B	Danh từ đơn là danh từ chỉ có một từ, ví dụ như 'car'.
0d5e3bcc-80fb-56d3-ae05-da5eeadb8d07	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	Identify the abstract noun in the following list:	table	car	bravery	London	C	Danh từ trừu tượng là những danh từ chỉ tình trạng hoặc chất lượng, như 'bravery'.
1f28853b-ca93-5bcb-8aa2-8c0c4caf69cb	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	What is the plural form of 'child'?	childs	children	childes	childrens	B	'Children' là dạng số nhiều của danh từ 'child', đây là một quy tắc bất quy tắc.
394b27ab-16bf-5064-a4c3-e3308b851321	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	What is the plural of 'foot'?	feet	feets	foots	footies	A	'Feet' là dạng số nhiều của 'foot', cũng là một quy tắc bất quy tắc.
4237205a-a4ed-5240-899f-c47e0fe996a1	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	Which of the following is an uncountable noun?	cat	cup	milk	book	C	Danh từ không đếm được chỉ những gì không thể đếm được như 'milk'.
687ee85f-b658-5950-8472-09863a47b829	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	Which of the following is an example of a concrete noun?	apple	happiness	freedom	love	A	Danh từ cụ thể là những danh từ chỉ những vật hữu hình mà chúng ta có thể cảm nhận bằng giác quan, như 'apple'.
8b89c9ab-09ba-5f98-a2e2-b6ec793e4f37	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	What is the correct plural form of 'box'?	boxes	boxs	boxen	boxies	A	Danh từ 'box' được tạo thành số nhiều bằng cách thêm '-es' vì nó kết thúc bằng 'x'.
9b7c97da-569e-5ca9-a934-f994713eedee	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	Identify the compound noun from the following:	darkness	light	moonlight	cloud	C	Danh từ ghép được tạo thành từ hai hoặc nhiều từ, 'moonlight' là một ví dụ.
a9cf67a2-b048-5126-95b2-bcd15c7d290f	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	What is the plural form of 'woman'?	women	womans	womanes	womyn	A	'Women' là dạng số nhiều của 'woman', đây là một ví dụ về danh từ bất quy tắc.
ad07799a-13e3-59a0-be23-4bced85aa90e	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	Identify the compound noun:	brush	toothbrush	teeth	clean	B	Danh từ ghép được tạo thành bằng cách kết hợp hai hoặc nhiều từ, như 'toothbrush'.
c686677d-fae0-5d25-87d6-de59436aa106	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	Identify the common noun in the list:	Eiffel Tower	John	river	Africa	C	Danh từ chung là thuật ngữ dùng để gọi tên những sự vật thuộc cùng một loại, như 'river'.
d114d65f-46f8-5d71-84b9-89931951ac36	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	Which of the following is a countable noun?	information	tree	sugar	rice	B	Danh từ đếm được có thể được đếm và có dạng số ít, ví dụ như 'tree'.
d223789d-932e-563f-958a-ad6848d73752	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	Which of the following shows an irregular plural?	class - classes	dog - dogs	cat - cats	leaf - leaves	D	'Leaves' là số nhiều bất quy tắc của 'leaf', trong khi các lựa chọn khác là quy tắc.
fb250f6e-39fe-56ac-a345-b4cbd8b7de79	f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	Choose the correct singular form of 'mice':	micey	mouses	mousee	mouse	D	Danh từ số ít của 'mice' là 'mouse', đây là một ví dụ về danh từ bất quy tắc.
004ef1b3-50d5-52d5-80cc-63c927090240	f95009eb-3ce7-5d9f-a678-94633d665307	Choose the correct possessive form.	The boy's ball.	The boys ball.	The boys' ball.	The boy ball.	B	Danh từ số ít cần 's để thể hiện sự sở hữu.
067d5107-b2f9-561e-b804-1cdc57463467	f95009eb-3ce7-5d9f-a678-94633d665307	Choose the correct possessive form for this sentence: "This is __________ book."	the teacher	the teachers'	the teachers	the teacher's	B	Sử dụng 's cho danh từ số ít để thể hiện sự sở hữu.
0c5fd39b-4e2c-55f7-9126-86eba96c64d7	f95009eb-3ce7-5d9f-a678-94633d665307	Select the correct possessive form.	A week's vacation.	A weeks vacation.	A week vacation's.	A vacation's week.	B	Phải sử dụng 's với danh từ chỉ thời gian để thể hiện sở hữu.
0e1dd6c5-b449-59c2-a3a9-306efdba89cc	f95009eb-3ce7-5d9f-a678-94633d665307	Identify which sentence uses possessive case incorrectly.	The man's coat.	The men's room.	The cars' repair.	The woman's purse.	C	Sử dụng sai sở hữu cách với danh từ không có dạng đúng.
5b3ac42c-c6e5-5ed4-b100-2849d74c52bd	f95009eb-3ce7-5d9f-a678-94633d665307	Identify the correct form of possessive.	Sarah's car.	Sarah car's.	Sarrah's car.	The car's of Sarah.	D	Cách thành lập sở hữu cách cho tên riêng là thêm 's.
5fe7b628-43d6-5b52-9180-1f3e61db2842	f95009eb-3ce7-5d9f-a678-94633d665307	What is the correct possessive form?	The teachers' rules.	The teachers rules.	The teacher's rules.	The rules of the teacher.	A	's phải được thêm vào danh từ số ít để diễn đạt sự sở hữu.
6843163c-806e-52d5-a228-b4013f81ab0d	f95009eb-3ce7-5d9f-a678-94633d665307	What is the correct possessive phrase?	The students's project.	The student's project.	The students project.	The students' projects.	C	Danh từ số nhiều không tận cùng bằng -s dùng 's.
6e8220dd-7c3b-5c39-b01a-af0fd320358f	f95009eb-3ce7-5d9f-a678-94633d665307	Which sentence shows possessive case correctly?	Mike's bike is new.	Mikes' bike is new.	Mikes bike is new.	The bike's of Mike is new.	A	Thêm 's cho danh từ chỉ người để diễn đạt sự sở hữu.
6f1fa0c7-51b2-5a66-9ce6-cfd3390e518d	f95009eb-3ce7-5d9f-a678-94633d665307	Choose the correct possessive form for this sentence: "This is __________ house."	the Jones's	the Jones'	the Jones	the Joneses's	C	Cách sử dụng ' với tên có tận cùng bằng -s là chỉ cần thêm ' .
719f41d3-8e64-5fd3-a9ab-e4699d5382f5	f95009eb-3ce7-5d9f-a678-94633d665307	Which sentence uses possessive case correctly?	The schools library.	The school's library.	The libraries of school.	School's libraries.	B	Danh từ số ít phải có 's để diễn đạt sự sở hữu.
75cfc6da-138c-597f-bb5a-bcadf8659f6d	f95009eb-3ce7-5d9f-a678-94633d665307	Which sentence uses possessive correctly?	Tim's hat is on the table.	The hats of Tim is on the table.	Tim hat's is on the table.	The Tim's hats is on the table.	A	Cần dùng 's để biểu thị sở hữu với danh từ chỉ người.
7d9a51f4-6670-58db-a488-85adf67ec556	f95009eb-3ce7-5d9f-a678-94633d665307	Which of the following is an incorrect use of possessive case?	The cat's toy.	The children's playground.	The dogs' owner.	The book's title.	C	Sử dụng sở hữu cách với danh từ số nhiều không tận cùng bằng -s là sai.
8ec647be-e2e4-5735-bda9-1c6d34ffd2c1	f95009eb-3ce7-5d9f-a678-94633d665307	Choose the correct expression for possessive.	The tom's cat.	Tom's cat.	The cat is Tom.	The cat of Tom.	D	Cách dùng 's để thể hiện sự sở hữu đúng là của người.
a5488f57-f0c2-5d9f-abf7-297e65f62fd2	f95009eb-3ce7-5d9f-a678-94633d665307	Identify the error in this sentence: "That is John book."	Should be: John's book.	Should be: John' book.	Should be: John books.	Should be: the book of John.	D	Cách đúng là thêm 's cho danh từ chỉ người.
ee660da2-451f-51cc-a10d-c3620c03931e	f95009eb-3ce7-5d9f-a678-94633d665307	Which sentence correctly shows possessive case?	This is my sister's book.	This is my sisters book.	This is my sister book.	This is of my sister book.	A	Cách thành lập sở hữu cách với danh từ số ít là thêm 's sau danh từ.
0123d84d-e238-5303-9d40-eabea18a22bc	c44f7fed-77ad-5229-9365-8cdc3575ecfc	You can choose ____ of these two options.	both	either	none	some	D	'Either' chỉ một trong hai, 'both' là cả hai.
12dcfe47-80a3-5e88-a119-254a32363d74	c44f7fed-77ad-5229-9365-8cdc3575ecfc	____ of the homework was difficult.	All	Each	Some	None	A	'All' chỉ tất cả mọi thứ.
146144bf-7914-5245-9b19-e003d8b01383	c44f7fed-77ad-5229-9365-8cdc3575ecfc	I met ____ interesting people during my trip.	some	none	any	most	B	'Most' có nghĩa là phần lớn, trong khi 'some' là một số lượng không xác định.
17b9b9c1-4ebf-5f5a-af39-f6f7526a044f	c44f7fed-77ad-5229-9365-8cdc3575ecfc	____ are my shoes right here.	This	That	These	Those	C	'These' được dùng để chỉ nhiều điều gì gần gũi.
2574f646-1932-5e73-bbf5-cc91da126ecf	c44f7fed-77ad-5229-9365-8cdc3575ecfc	There are ____ people at the meeting.	none	some	all	any	A	'None' có nghĩa là không có ai. Phải dùng đúng vào ngữ cảnh.
2ebeaa0a-b7fd-575c-b41e-c9055e2d35d8	c44f7fed-77ad-5229-9365-8cdc3575ecfc	I can't find my wallet anywhere! Did you see ____?	something	everything	anything	nothing	B	Sử dụng 'everything' để chỉ tất cả những thứ.
386fe23c-59e9-5aed-b9e2-2c9e6e3bd1d8	c44f7fed-77ad-5229-9365-8cdc3575ecfc	____ is my friend over there.	This	That	These	Those	B	Sử dụng 'that' để chỉ điều gì xa hơn với người nói.
51bb9454-1e10-5fcf-bcbb-11fab6c64784	c44f7fed-77ad-5229-9365-8cdc3575ecfc	____ book on the table is mine.	This	Those	Each	That	C	'Each' được dùng để chỉ từng cá thể trong một nhóm.
53477cb1-a0fe-5b3f-960d-134dd952267a	c44f7fed-77ad-5229-9365-8cdc3575ecfc	____ of the cookies were eaten.	Most	Each	Either	Neither	A	'Most' chỉ phần lớn, hầu hết.
74134d77-c1fc-5a60-bdd1-4dd3c0705cd1	c44f7fed-77ad-5229-9365-8cdc3575ecfc	Do you know ____ of my neighbors?	some	any	none	most	C	'Any' được dùng để hỏi khi không biết cụ thể.
a778e357-5cf9-58ac-8a35-9dec90478503	c44f7fed-77ad-5229-9365-8cdc3575ecfc	I don't like ____ color.	some	any	all	none	D	'None' được dùng để chỉ không có cái nào.
dba67726-45c6-5f76-8a60-025646be14e2	c44f7fed-77ad-5229-9365-8cdc3575ecfc	____ of my friends are coming to the party.	This	Both	That	Any	D	'Any' được dùng để chỉ một hoặc nhiều điều không xác định.
dbb7a1d1-1b75-524d-858e-87bc2c9d66fb	c44f7fed-77ad-5229-9365-8cdc3575ecfc	____ is my favorite movie.	This	That	These	Those	A	Sử dụng 'this' để chỉ điều gì gần gũi với người nói.
e9fa49dc-7ef2-591b-bcc8-9bc3d97ea92c	c44f7fed-77ad-5229-9365-8cdc3575ecfc	Do you have ____ ideas for the project?	some	any	all	none	B	'Any' thường được dùng trong câu hỏi.
fb79afc5-e168-5ae9-85dc-1841b698558b	c44f7fed-77ad-5229-9365-8cdc3575ecfc	____ of the answers was correct.	Neither	Each	Any	Some	C	'Any' thường dùng trong phủ định.
27a8e068-892b-53d6-b4f3-a2ae5d66b8c3	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn câu đúng với cách dùng đại từ nhân xưng: "The children are playing. I can see ___ ."	them	they	their	he	A	"them" là đại từ tân ngữ thay thế cho 'The children'.
2fcfe605-d854-5cd9-a667-3185e74c4fa4	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn câu đúng với đại từ sở hữu: "Is this book ___?"	your	yours	you	he	B	"yours" đúng ở đây vì không có danh từ theo sau, chỉ sự sở hữu.
31bb427f-4716-5c31-9f69-df6e8115a56c	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn câu đúng với đại từ phản thân: "He taught __ how to swim."	his	he	him	himself	D	"himself" là đại từ phản thân, làm tân ngữ cho 'He'.
43138bbc-ec64-5534-8b94-7d9ff573abe9	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn câu đúng: "Do you have ___ pencil?"	your	yourself	you	yours	D	"yours" được dùng để không có danh từ theo sau và chỉ sự sở hữu.
46785143-57a4-523b-95ee-e8257bd24088	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn đại từ đúng: "You should do it by __ ."	you	yourself	your	yours	B	"yourself" là đại từ phản thân, làm tân ngữ cho 'you'.
49617b9f-7a39-5258-b58a-ca9992ef547b	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn phương án đúng: "This is __ house."	my	mine	me	I	A	"my" là đại từ sở hữu dùng trước danh từ 'house'.
58ab60c4-03d5-5308-a461-e070ef07568f	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn câu đúng với cách dùng đại từ nhân xưng: "Tom is my friend. I often visit ___ ."	they	he	he's	him	D	"him" là đại từ tân ngữ, thay thế cho 'Tom'.
75de3b5d-5b18-54ba-8288-705fc4bef995	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn câu đúng với cách dùng đại từ nhân xưng: "Sarah and I like ice cream. ___ often eat it together."	We	Us	They	She	A	Dùng "we" vì đó là chủ ngữ, thay thế cho 'Sarah and I'.
79076768-88ed-5325-8d9c-33fd96ca3e4d	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn đại từ sở hữu: "That backpack is ___ ."	you	yours	your	he	B	"yours" là đại từ sở hữu và không cần danh từ theo sau.
86ca4cc7-3ad0-5a93-b717-b9eec846a766	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn câu đúng với đại từ phản thân: "The cat cleaned __ ."	its	it	itself	them	C	"itself" là đại từ phản thân dùng cho chủ ngữ 'the cat'.
8f4fe0bc-6f4a-5f61-8838-5589cc827a9f	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn đại từ nhân xưng đúng: "John likes chocolate. ___ eats it every day."	He	Him	He’s	Them	A	"He" là đại từ nhân xưng chủ ngữ thay thế cho 'John'.
bb413af1-52e6-5d40-ac0a-fe3f07c0654b	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn đại từ phản thân: "They enjoyed the trip by ___ ."	themselves	them	they	theirs	C	"themselves" là đại từ phản thân, làm tân ngữ cho chủ ngữ 'They'.
e829d009-ffa9-5349-adba-99a215f60e4c	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn câu đúng với đại từ phản thân: "She did it by ___."	her	she	herself	he	C	"herself" là đại từ phản thân, dùng làm tân ngữ cho chủ ngữ 'she'.
f108dfab-e6ee-52be-b291-74c188916cfe	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn câu phù hợp với đại từ sở hữu: "These are my shoes, and those are __ ."	them	you	yours	your	C	"yours" được dùng để chỉ sự sở hữu mà không cần danh từ.
ffb826d4-1d23-5497-a40e-c83f670f149b	c84e6026-05dc-5f91-90f0-f86203b2d217	Chọn đại từ sở hữu chính xác: "This book is ___ ."	her	hers	she	he	B	"hers" là đại từ sở hữu và không cần danh từ theo sau.
20745607-16bd-5f61-a24e-47b92211d072	e3ad0784-e520-561b-99c8-be2bfda7c8e0	The ___ cat slept on the chair.	black fluffy	fluffy black	fluffiness black	blacker fluffy	D	Trật tự tính từ yêu cầu 'fluffy' phải đứng sau 'black'.
25b08430-fa23-54fc-856b-4dac00522733	e3ad0784-e520-561b-99c8-be2bfda7c8e0	She bought a ___ dress for the party.	beautiful	beauty	beautifully	beauties	A	Trong cụm danh từ, tính từ 'beautiful' đứng trước danh từ 'dress'.
2664e58a-6c2c-5f02-bf8e-1eadd98dc9d4	e3ad0784-e520-561b-99c8-be2bfda7c8e0	These ___ boots are very comfortable.	new red	red new	newer red	recent red	B	Trong câu có hai tính từ, 'new' đứng trước 'red'.
4c840ed0-baaf-5a20-b916-917520e632a0	e3ad0784-e520-561b-99c8-be2bfda7c8e0	She wore a ___ dress to the gala.	shiny long	long shiny	shiner long	shine long	C	Trật tự tính từ cho thấy 'long' nên đứng trước 'shiny'.
58ad1de0-8b12-5963-8fc8-a937da479aa4	e3ad0784-e520-561b-99c8-be2bfda7c8e0	They are considered the ___ workers in the company.	hardest	hard	hardly	hardened	A	Tính từ 'hardest' là dạng so sánh hơn, đứng trước danh từ 'workers'.
6c3e0f58-4617-56e1-aa87-1c1662fd157b	e3ad0784-e520-561b-99c8-be2bfda7c8e0	We need a ___ kitchen for cooking.	functions	functioning	functionally	functional	A	Khi nói về một tính từ, 'functional' là đúng.
789f4873-ff26-5792-8fb6-e7ec96e12207	e3ad0784-e520-561b-99c8-be2bfda7c8e0	This is a ___ movie.	boring	bore	bored	borders	D	Tính từ 'boring' dùng để mô tả danh từ 'movie'.
82da06f4-fa42-54d9-8cb9-32ae316e2549	e3ad0784-e520-561b-99c8-be2bfda7c8e0	___ children enjoy going to the museum.	The	Those	Some	Much	C	'Some' là từ định lượng đứng trước danh từ 'children'.
968e4e7d-734d-5ad4-8974-b4ecbea462a4	e3ad0784-e520-561b-99c8-be2bfda7c8e0	They live in a ___ house.	small old	old small	old	smaller	A	Trong cụm danh từ với hai tính từ, 'small' đứng trước 'old'.
9e7af4bf-a27a-5048-8fcf-27b0a6e10c1b	e3ad0784-e520-561b-99c8-be2bfda7c8e0	She is the ___ student in her class.	talented	talentedly	talents	talen	D	Tính từ 'talented' mô tả 'student' và không cần dùng dạng khác.
c6630d2d-5520-5e55-800a-7dd0e7240655	e3ad0784-e520-561b-99c8-be2bfda7c8e0	The ___ flowers bloom in spring.	beautiful	beauty	beautifully	beau	C	'Câu sử dụng tính từ 'beautiful' đứng trước danh từ 'flowers'.
d07a8782-aa85-5e49-969f-826c37e06079	e3ad0784-e520-561b-99c8-be2bfda7c8e0	His ___ ideas were well received by everyone.	creative	creation	creatively	creates	B	Tính từ 'creative' đứng trước danh từ 'ideas'.
d1777c16-5333-50e2-820e-677f59d530d5	e3ad0784-e520-561b-99c8-be2bfda7c8e0	The ___ child played happily in the park.	cheerful	cheering	cheer	cheers	B	'Cheerful' là tính từ mô tả 'child', đứng trước danh từ.
fcbbfaf0-5cb7-530a-a77a-62665c0904f7	e3ad0784-e520-561b-99c8-be2bfda7c8e0	She has a ___ book about history.	old interesting	interesting old	old	interested old	C	Câu sử dụng một tính từ 'old', không cần sắp xếp lại.
feed8017-fe61-526f-bafe-3f19496935e9	e3ad0784-e520-561b-99c8-be2bfda7c8e0	The soup tastes so ___.	deliciously	delicious	deliciousness	delicioused	B	Tính từ 'delicious' đứng sau liên từ 'tastes' để mô tả vị của súp.
05ddbdf4-67ac-5841-8d98-d98cd6e783d8	689c6bc9-460b-51f5-adef-b362c2de669d	Chọn trạng từ chỉ nơi chốn trong câu: The book is placed _____ the shelf.	upstairs	usually	quickly	slowly	C	'Upstairs' là trạng từ chỉ nơi chốn, rõ ràng mô tả vị trí của quyển sách.
13c51cbe-d771-59ff-b2a4-355f9542100c	689c6bc9-460b-51f5-adef-b362c2de669d	Chọn trạng từ nghi vấn nào? _____ do you go to school?	Where	Quickly	Today	Very	C	'Where' là một trạng từ nghi vấn để hỏi về nơi, nhưng 'today' có thể là một câu hỏi về thời gian.
1686afb4-427e-5b35-8ff2-b663059b673a	689c6bc9-460b-51f5-adef-b362c2de669d	Chọn trạng từ chỉ thời gian phù hợp: We will meet _____ at the café.	carefully	tomorrow	loudly	anywhere	B	Trạng từ chỉ thời gian thông báo thời điểm xảy ra hành động, 'tomorrow' là lựa chọn đúng.
25715789-d5c1-5e82-8683-3410391ef4ec	689c6bc9-460b-51f5-adef-b362c2de669d	Chọn trạng từ quan hệ phù hợp trong câu: I remember the place _____ we first met.	how	where	why	when	D	'Where' là trạng từ quan hệ phù hợp trong ngữ cảnh này.
280a0efe-8f5d-54d8-99fe-9a9ee10463cf	689c6bc9-460b-51f5-adef-b362c2de669d	Chọn trạng từ chỉ nơi chốn trong câu: The dog is playing _____ the garden.	outdoors	often	carefully	yesterday	D	'Outdoors' là một trạng từ chỉ nơi chốn, 'yesterday' là một trạng từ chỉ thời gian không phù hợp.
2d20280a-5171-5377-8a73-1f6e3e27a4f1	689c6bc9-460b-51f5-adef-b362c2de669d	Chọn trạng từ chị mức độ phù hợp: She is _____ tired after the long journey.	extremely	here	carefully	yesterday	A	'Extremely' là trạng từ chỉ mức độ, báo hiệu sự mệt mỏi lớn.
404199d1-604e-59b2-824b-4db9b4140aa3	689c6bc9-460b-51f5-adef-b362c2de669d	Chọn trạng từ chỉ thời gian trong câu: I will call you _____.	almost	quickly	sometimes	soon	C	'Soon' là lựa chọn đúng mô tả thời điểm gọi.
55f0504a-07b8-5620-a23f-c1ff2b061e49	689c6bc9-460b-51f5-adef-b362c2de669d	Chọn trạng từ chỉ tần suất trong câu: She _____ exercises twice a week.	usually	hard	suddenly	yesterday	A	'Usually' là trạng từ chỉ tần suất, mô tả mức độ thường xuyên của hành động.
5f20bd30-bf78-5fa2-910f-80d4831c0846	689c6bc9-460b-51f5-adef-b362c2de669d	Điền trạng từ vào câu: He answered the questions _____ .	brilliantly	frequently	here	this morning	B	'Frequent' không phải là trạng từ chỉ cách thức mà chỉ mức độ, mặc dù nó có thể thường xuyên được sử dụng trong ngữ cảnh khác.
60ec9c4a-7382-5614-9e05-9558d35fd4c6	689c6bc9-460b-51f5-adef-b362c2de669d	Điền trạng từ vào câu: He goes to the gym _____ on Mondays.	quickly	frequently	very	yesterday	C	Mặc dù 'frequently' có thể là một lựa chọn, 'very' là một trạng từ chỉ mức độ đặc biệt trong ngữ cảnh này.
aa441024-fc09-5c93-b42c-994eda75438f	689c6bc9-460b-51f5-adef-b362c2de669d	Chọn trạng từ chỉ cách thức trong câu: They danced _____ at the party.	beautifully	sometimes	nowhere	always	B	'Beautifully' là trạng từ chỉ cách thức diễn tả cách thức họ nhảy múa.
b016be6d-c4e8-5967-858e-d1224b66e023	689c6bc9-460b-51f5-adef-b362c2de669d	Chọn trạng từ quan hệ đúng trong câu: I wonder the reason _____ he left early.	how	why	when	where	B	'Why' là trạng từ quan hệ phù hợp giải thích nguyên nhân.
dad0962a-87cc-502c-a51c-8c86269296cd	689c6bc9-460b-51f5-adef-b362c2de669d	Chọn trạng từ chỉ cách thức trong câu: She sings _____.	beautifully	yesterday	here	often	A	Trạng từ chỉ cách thức mô tả cách thức hành động diễn ra, 'beautifully' là lựa chọn đúng.
e7917256-cfbb-511e-a14e-e14dc53accdc	689c6bc9-460b-51f5-adef-b362c2de669d	Điền một trạng từ vào câu: They will travel _____ next week.	carefully	last	quite	often	A	'Carefully' là trạng từ chỉ cách thức, nhấn mạnh họ sẽ đi du lịch một cách cẩn thận.
e821802b-cf60-5997-9304-bf0a751a30af	689c6bc9-460b-51f5-adef-b362c2de669d	Chọn trạng từ chỉ tần suất trong câu: He _____ forgets to do his homework.	never	badly	somewhere	quickly	D	'Never' phù hợp vì là trạng từ chỉ tần suất mô tả mức độ thường xuyên của hành động.
0f3bc01c-114b-5844-9ee0-1597df0545be	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	Not only __________ they excited, but they were also nervous.	were	are	was	have	B	'Not only' yêu cầu đảo động từ với trợ động từ đứng trước chủ ngữ.
1deaae98-3e85-521a-9b55-04d2a9bb7f0b	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	So interesting __________ the lecture that I couldn't stop taking notes.	was	did	were	is	C	Cấu trúc 'So + tính từ + trợ động từ + chủ ngữ + động từ chính' yêu cầu đảo động từ.
210e2879-85b0-56ff-98e9-6c53aa75f2e7	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	Seldom __________ I hear such beautiful music.	have	am	was	do	D	'Seldom' yêu cầu đảo động từ với trợ động từ đứng trước chủ ngữ.
22b25584-e015-508a-8465-0a4ad0c73a43	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	So bright __________ the stars that we could see them clearly.	was	are	have	were	A	Cấu trúc 'So + tính từ + trợ động từ + chủ ngữ' yêu cầu đảo ngữ.
2632b906-519f-58fc-9d81-8401f703803d	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	Barely __________ I finished the task when I got a call.	was	had	did	could	B	'Barely' yêu cầu trợ động từ đứng trước chủ ngữ trong cấu trúc đảo ngữ.
3705da2f-be98-5fe6-b844-d399bc5f5025	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	Rarely __________ I see such talent in a young musician.	do	does	am	have	B	Khi sử dụng 'Rarely', động từ phải được đảo với trợ động từ đứng trước chủ ngữ.
3a33caf2-206c-5652-bfd5-35dd190c5a8f	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	Only if __________ we work together can we finish on time.	we	he	they	she	C	'Only if' yêu cầu đảo ngữ với trợ động từ đứng trước chủ ngữ.
45921cc0-3f6f-54c8-b3af-61bec1d181c7	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	Not only __________ she proficient in French, but she also speaks Spanish.	is	was	does	has	D	'Not only' yêu cầu đảo động từ với trợ động từ đứng trước chủ ngữ.
9b574652-097a-5f29-b19b-15188fde4d12	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	Under no circumstances __________ this door be opened.	must	should	could	might	A	Cấu trúc đảo ngữ với 'Under no circumstances' yêu cầu trợ động từ phải đứng trước chủ ngữ.
9e344b85-a7b8-56aa-934c-c4050666bb68	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	Never __________ I expected such an outcome.	did	am	was	have	A	Khi sử dụng 'Never', cần đảo động từ với trợ động từ đứng trước chủ ngữ.
accda675-9904-56c3-b634-7bd38308a768	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	Seldom __________ I attend such formal events.	am	do	have	be	B	Khi dùng 'Seldom', cần đảo động từ với trợ động từ đứng trước chủ ngữ.
b29463d7-4d25-5d16-84ee-8366f9deef57	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	Hardly __________ I finished my dinner when the phone rang.	had	did	was	has	A	Cấu trúc với 'Hardly' yêu cầu đảo động từ với trợ động từ đứng trước chủ ngữ.
e5b7c68d-26a2-59e3-b017-9121d716a760	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	So quickly __________ she completed the project that everyone was amazed.	did	was	has	would	C	Cấu trúc 'So + tính từ + trợ động từ + chủ ngữ' yêu cầu sử dụng dạng đảo ngữ.
fc9f9efa-14e9-54fa-a3d5-f6c1b63ba87f	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	Hardly __________ we arrived when the game started.	have	were	did	was	C	Cấu trúc với 'Hardly' yêu cầu đảo ngữ với trợ động từ đứng trước chủ ngữ.
fdb55ce1-d4b6-5863-9f8b-4d3be226fe05	ea768c0f-ec9b-509a-9d92-6f9eaba3899f	Little __________ I know about the subject before the exam.	did	was	am	has	D	'Little' yêu cầu trợ động từ đứng trước chủ ngữ trong cấu trúc đảo ngữ.
190eaa81-9010-5e42-a671-4f4444669e6b	135bb7ce-093e-5f8e-98dc-21f4b72eba36	Fill in the blank: 'He _____ work hard.'	must	mud	moy	may	A	'Must' được sử dụng để diễn tả sự bắt buộc.
2636ca86-060f-52a0-9cd7-1490b2a9966f	135bb7ce-093e-5f8e-98dc-21f4b72eba36	Identify the verb type in the sentence: 'She reads a book every night.'	Transitive	Intransitive	Regular	Irregular	A	Động từ 'reads' ở đây là ngoại động từ vì nó có tân ngữ 'a book'.
29d3ab42-5d13-5123-83ba-38fa219e8cf3	135bb7ce-093e-5f8e-98dc-21f4b72eba36	Select the correct form: 'Did you _____ the homework?'	finished	finishing	finish	finishes	C	Phải dùng động từ nguyên thể 'finish' sau 'did'.
4119e8d2-6b09-5787-a317-56762cf1e2f8	135bb7ce-093e-5f8e-98dc-21f4b72eba36	What is the past form of 'be'?	beed	was/were	been	was	B	'Was/were' là hình thức quá khứ của động từ 'be'.
45a29ab6-611e-508b-bb73-831b674b8fc4	135bb7ce-093e-5f8e-98dc-21f4b72eba36	What is the simple past of 'drink'?	drinked	drank	drunk	drinking	B	'Drank' là thì quá khứ của 'drink', đây là động từ bất quy tắc.
519b2273-c614-53ce-af64-116fc3841b4b	135bb7ce-093e-5f8e-98dc-21f4b72eba36	Choose the correct form: 'They _____ a song yesterday.'	singed	sangded	sang	sung	C	Hình thức quá khứ của 'sing' là 'sang'.
52d1a1d7-7a56-505c-96b4-cd3cdea4508d	135bb7ce-093e-5f8e-98dc-21f4b72eba36	Choose the past participle of 'do'.	doed	did	done	doing	C	'Done' là quá khứ phân từ của động từ 'do'.
54ea2668-8ff4-55db-8bce-8c5be00ed92d	135bb7ce-093e-5f8e-98dc-21f4b72eba36	Choose the correct sentence:	She don't like coffee.	She doesn't like coffee.	She doesn't likes coffee.	She not like coffee.	B	Câu phủ định đúng sử dụng 'doesn't' với động từ nguyên thể 'like'.
a9f3ac56-f163-51d2-bc81-863f6a89176c	135bb7ce-093e-5f8e-98dc-21f4b72eba36	What is the past tense of 'go'?	goed	went	gone	going	B	'Went' là thì quá khứ của động từ 'go', đây là động từ bất quy tắc.
b063d12d-ef30-5f88-a9a1-e148e17de6db	135bb7ce-093e-5f8e-98dc-21f4b72eba36	Identify the correct past participle of 'write'.	writing	write	written	wrote	C	'Written' là quá khứ phân từ của 'write'.
b293de9a-6056-5106-a86f-0b262f3c21e0	135bb7ce-093e-5f8e-98dc-21f4b72eba36	Which is a primary auxiliary verb?	help	need	like	have	D	'Have' là một trong các trợ động từ chính.
bb2610ec-3e40-55b3-9f03-25dc5dbf108c	135bb7ce-093e-5f8e-98dc-21f4b72eba36	Identify the verb type: 'He sleeps.'	Intransitive	Transitive	Regular	Irregular	A	'Sleeps' là nội động từ vì không cần tân ngữ.
c82b18bd-2966-5d99-9923-4b844fa9c2c4	135bb7ce-093e-5f8e-98dc-21f4b72eba36	Which one is not a primary auxiliary verb?	do	have	be	should	D	'Should' không phải là trợ động từ chính mà là một động từ giúp.
d5fe961d-2980-599d-9157-ef806bbf461e	135bb7ce-093e-5f8e-98dc-21f4b72eba36	Identify the type of verb in: 'They are running.'	Intransitive	Transitive	Regular	Irregular	A	'Running' là nội động từ vì không có tân ngữ theo sau.
fbb777da-b841-5717-8fef-620a1c3a6c2f	135bb7ce-093e-5f8e-98dc-21f4b72eba36	What is the present tense of 'to be' for 'they'?	be	is	am	are	D	'Are' là thì hiện tại của động từ 'be' cho 'they'.
3809a73a-4af5-51b8-8443-847f35db98ec	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	The film was very ___.	boring	bored	bore	boredly	A	'Boring' là hiện tại phân từ, dùng để diễn tả đặc điểm của bộ phim.
3e66e934-2410-5f84-af0c-5313b70f2d77	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	They are ___ to finish the project soon.	determinedly	determine	determinate	determined	D	'Determined' là tính từ, mô tả tâm trạng của họ.
495e9e56-cb4b-51f8-bfda-731b3da9e988	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	The soup smells ___.	well	good	better	goodly	B	Tính từ 'good' được dùng sau hệ từ 'smell' để mô tả trạng thái.
5b670366-eb52-522f-8ce3-57c85396ff16	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	This cake smells ___.	deliciously	delicious	delightful	delightfully	B	'Delicious' là tính từ được sử dụng sau hệ từ 'smell' để mô tả bánh.
5d76ff96-d219-5183-8918-61e1a153a436	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	She felt ___ after the long hike.	tiring	tire	tired	tirely	C	'Tired' là quá khứ phân từ, mô tả trạng thái của cô ấy.
663f0c12-8749-5997-a653-f1b11590ac04	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	The broken vase was ___ by the children.	broke	breaking	broken	breaked	C	Quá khứ phân từ của 'break' là 'broken', được sử dụng để mô tả tình trạng.
97c85d46-889e-53d8-bdad-6e40695d90be	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	The children were ___ by the magician's tricks.	fascinated	fascinating	fascinate	fascination	A	'Fascinated' là quá khứ phân từ, dùng để mô tả cảm xúc của trẻ em.
b712c426-a72e-519f-87b3-ca8abc886c5a	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	He seems ___ today than yesterday.	happier	happy	happi	happily	B	'Seem' là một hệ từ, cần sử dụng tính từ để bổ nghĩa cho chủ ngữ.
bd75c4d4-24ce-5044-992a-725b01b6aec1	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	Tom is ___ that he has won the prize.	happily	happy	happier	happiness	B	'Happy' là tính từ miêu tả trạng thái của Tom.
c1b758d3-5e1f-5ae2-85d5-93cab98c38c4	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	What did you find ___ in the drawer?	lay	lying	lie	laid	C	'Lie' là động từ nguyên mẫu, mô tả vị trí của vật trong ngăn kéo.
c5081f3d-eaa8-5b23-9874-50a8d6cf4c97	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	What is the present participle of 'run'?	running	ran	runed	runs	A	Hiện tại phân từ được hình thành bằng cách thêm -ing vào động từ nguyên mẫu.
c5700e12-7483-5107-a5cc-62b965fb8993	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	He found the book ___ on the table.	lay	lying	laid	lie	D	'Lie' là động từ nguyên mẫu, cần sử dụng trong câu để diễn tả trạng thái.
c5e27118-d48d-5f7d-94d8-c7fdc9ea9244	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	She is ___ in her work.	bore	boring	boredly	bored	D	Trong trường hợp này, 'bored' là quá khứ phân từ, mô tả cảm xúc của chủ ngữ.
caf5eeb5-c599-54b9-8249-8ff82db24766	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	They are ___ to go to the party.	exciting	excited	excite	excitedly	A	Ở đây cần dùng hình thức hiện tại phân từ 'exciting' để nói về sự kiện.
f3a04db8-b155-5204-91a1-e34020a931a7	e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	The dog is ___ to see us.	exciting	excite	excited	excitement	C	'Excited' là tính từ được dùng để mô tả cảm xúc của con chó.
23a93139-b962-5b3a-865a-e34e88d25847	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	___ does she live?	When	Why	Where	What	C	Dùng 'Where' để hỏi về địa điểm sống.
2a496c74-51c3-5a55-b2b4-6d807bb27026	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	The book ___ I borrowed is very interesting.	that	whose	who	which	C	Dùng 'that' để chỉ quyển sách đã mượn.
33049d0e-f553-5cb4-920e-f2522b529c42	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	This is the restaurant ___ we ate last week.	whose	which	that	who	D	Dùng 'that' để chỉ nơi đã đến.
3884455c-4010-52be-854e-58aca533e2ca	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	___ is your favorite color?	Where	What	Who	When	B	Dùng 'What' để hỏi về màu sắc yêu thích.
4cdf5352-f3d1-5f3c-9f78-b81f7eea3042	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	___ do you want to go to the movies?	How	When	Why	Who	D	Câu hỏi nhu cầu câu trả lời về lý do, nên cần dùng 'Why'.
70decb4e-010e-59d9-b293-92772e1fa40d	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	___ is your new bike?	What	Whom	Who	Where	B	Dùng 'What' để hỏi về thứ cụ thể.
8ad7ba6a-3318-5f19-bcd6-5699a006309d	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	He is the one ___ I met at the conference.	who	whom	whose	which	D	Dùng 'whom' để bổ sung thông tin cho 'the one'.
8cbac8c2-cc76-55fa-a823-a55e4c91a14e	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	The woman ___ called you is my sister.	whom	that	which	who	B	Dùng 'that' để bổ sung thông tin cho danh từ 'woman'.
9793cb5f-4565-5cf1-803f-976d51291dc6	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	This is the person ___ helped me yesterday.	whom	that	whose	which	B	Dùng 'that' để liên kết với 'person'.
9a77bbe3-0641-5edf-8b58-99f74bbfe4d4	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	The teacher ___ I admire most is very kind.	whose	who	that	whom	C	Dùng 'that' để liên kết mệnh đề với danh từ 'teacher'.
9dbbed23-5979-5f95-875c-125ed23cc18d	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	I don't know ___ he is angry.	when	why	how	where	C	Dùng 'how' để hỏi về cách mà anh ấy đang tức giận.
a33bcb68-4c84-57ba-bea9-6e7a46aa0866	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	___ did you come to the party?	When	Who	Where	What	A	Dùng 'When' để hỏi thời gian tới bữa tiệc.
a9e7a682-3d03-5b77-9ff3-e4e3d0a22152	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	I don't know ___ to call for help.	what	when	why	how	A	Dùng 'what' để hỏi về một việc cụ thể.
caefff52-8113-5ede-b62b-6215ff5a8540	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	What ___ you think about the proposal?	do	does	is	has	A	Câu hỏi cần dùng 'do' để hỏi ý kiến về đề xuất.
dfa4e8a8-7d01-5823-96a9-ec90d0dfd5c5	f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	Whose book is this on the table?	Who	What	How	Where	A	Dùng 'Whose' để chỉ sở hữu của quyển sách.
093656e9-4d9a-5a1e-9187-a69286d307a2	2668d9b8-e985-5cf4-88db-0064a2e059a2	Identify the descriptive adjective in: 'The tall building was demolished.'	demolished	tall	building	the	D	Tính từ mô tả được dùng để chỉ đặc điểm, trong trường hợp là 'tall'.
0f3c0a28-9ec5-5ed1-b75b-bdc04bda44c8	2668d9b8-e985-5cf4-88db-0064a2e059a2	Which word is a descriptive adjective?	happy	that	her	three	A	Tính từ mô tả là từ chỉ đặc điểm, ví dụ 'happy' (vui vẻ).
1cfbd4f4-b8ef-5565-b827-14fc12dc63b6	2668d9b8-e985-5cf4-88db-0064a2e059a2	Choose the limiting adjective in this sentence: 'I want that book.'	wants	that	book	I	B	Tính từ giới hạn giúp xác định danh từ, trong câu này 'that' là tính từ chỉ định.
32df2f96-2951-503e-8cb8-ff7a87d29d09	2668d9b8-e985-5cf4-88db-0064a2e059a2	Select the limiting adjective in: 'This is my favorite restaurant.'	favorite	my	this	restaurant	B	Tính từ giới hạn là từ chỉ sở hữu, ở đây là 'my'.
3f40c82f-419d-55e2-9087-545d5e1ab509	2668d9b8-e985-5cf4-88db-0064a2e059a2	What type of adjective is 'world-famous'?	Simple adjective	Compound adjective	Limiting adjective	Descriptive adjective	B	'world-famous' là tính từ ghép vì được tạo thành từ hai từ.
53673421-f3d0-5700-9a91-7b760b84daad	2668d9b8-e985-5cf4-88db-0064a2e059a2	In the sentence 'The children seem excited,' what function does 'excited' serve?	Attributive	Limiting	Predicative	Descriptive	C	Tính từ vị ngữ ở đây là 'excited' vì nó đứng sau động từ liên kết.
5a7c98b0-37be-574e-8494-ed6cd857a3b8	2668d9b8-e985-5cf4-88db-0064a2e059a2	Choose the correct structure: 'I have ___ new bike.'	two	another	that	some	A	Cách dùng 'another' là cho danh từ số ít, ở đây là cần tính từ giới hạn, 'two' là đúng.
76f5bda9-617b-5c88-ab34-c2df0f59b389	2668d9b8-e985-5cf4-88db-0064a2e059a2	What is the function of 'other' in 'Some other people arrived'?	Attributive	Limiting	Descriptive	Predicative	A	'other' là tính từ giới hạn dùng để chỉ một nhóm khác.
9dbb1d76-a328-5b00-a55c-80ebcd1af64f	2668d9b8-e985-5cf4-88db-0064a2e059a2	Identify the predicative adjective in: 'The flowers are beautiful.'	flowers	beautiful	are	the	B	Tính từ vị ngữ ở đây là 'beautiful', đứng sau động từ 'are'.
a4f52024-ec91-5190-9f46-ada6f27de57f	2668d9b8-e985-5cf4-88db-0064a2e059a2	Select the incorrect sentence regarding adjectives: 'She is a very kind girl.'	correct	false	wrong	incorrect	D	Câu không sai, chọn 'incorrect' không phải từ phù hợp.
b1357f8a-1896-50a9-b71f-c2f90f4f7f74	2668d9b8-e985-5cf4-88db-0064a2e059a2	What type of adjective is 'two' in 'I have two cats'?	Descriptive	Attributive	Limiting	Predicative	C	'two' là tính từ giới hạn, giúp xác định số lượng cho danh từ.
b65306ff-3b9d-595a-bdc9-7003a62d927f	2668d9b8-e985-5cf4-88db-0064a2e059a2	Identify the predicative adjective: 'The soup tastes delicious.'	soup	tastes	delicious	The	C	Tính từ vị ngữ đứng sau động từ liên kết, trong trường hợp này là 'delicious'.
c1f21025-4290-50f6-aa9d-a360aa41e5d4	2668d9b8-e985-5cf4-88db-0064a2e059a2	Which choice contains a compound adjective?	beautiful	happy	old	high-quality	D	Tính từ ghép được tạo thành từ hai từ trở lên, ví dụ 'high-quality'.
d8a3a35e-973d-5228-94a2-62430d84f693	2668d9b8-e985-5cf4-88db-0064a2e059a2	In the sentence 'She is a wonderful teacher,' what type of adjective is 'wonderful'?	Attributive	Predicative	Limiting	Descriptive	A	Tính từ thuộc ngữ đứng trước danh từ, trong trường hợp này là 'wonderful'.
ef66c38f-a511-5783-98bd-02e75c1221c5	2668d9b8-e985-5cf4-88db-0064a2e059a2	Which is an attributive adjective?	She seems sad.	a red car	They are happy.	He looked tired.	C	Tính từ thuộc ngữ thuộc dạng đứng trước danh từ, ví dụ 'red' trong 'a red car'.
0c98169a-a180-5f83-90f7-163918217cb6	677cc65d-415c-5207-bc30-5332b850afae	Choose the correct sentence using Present Perfect Continuous.	She has been studying for her exams all week.	She has studied for her exams all week.	She is studying for her exams all week.	She studies for her exams all week.	A	Câu này sử dụng thì hiện tại hoàn thành tiếp diễn để diễn tả hành động đã bắt đầu trong quá khứ và kéo dài tới hiện tại.
11d0f81f-b0ff-5d6c-bd13-ac537274f25d	677cc65d-415c-5207-bc30-5332b850afae	What is the best way to express this idea: 'I started jogging three months ago.'	I have been jogging for three months.	I jogged for three months.	I am jogging for three months.	I have jogged for three months.	A	Câu A diễn tả hành động bắt đầu trong quá khứ và kéo dài tới hiện tại.
32ec9db8-a877-5c28-9d39-57e6a47a29d0	677cc65d-415c-5207-bc30-5332b850afae	Which sentence correctly asks a question?	Is he been running?	Have he been running?	He has been running?	Has he been running?	D	Câu A là câu hỏi đúng với cấu trúc 'Has' cho ngôi 'he'.
3508f49b-c0bd-5539-a99e-68e474257949	677cc65d-415c-5207-bc30-5332b850afae	Identify the incorrect part of the sentence: 'I have been visited my grandparents.'	have been	my grandparents	visited	I	C	Câu này sai vì động từ 'visited' phải ở dạng '-ing' thành 'visiting'.
366e12d5-f592-5154-96ea-c571d5774000	677cc65d-415c-5207-bc30-5332b850afae	Choose the correct form: 'I ___ (learn) English for two years.'	have been learning	has been learning	am learning	learned	A	Câu này cần sử dụng 'have been learning' để diễn đạt hành động kéo dài tới hiện tại.
37f067cc-cef4-5844-b3bc-3dccaddbf53f	677cc65d-415c-5207-bc30-5332b850afae	Choose the correct negative form.	He has not been exercising lately.	He have not been exercising lately.	He has not exercise lately.	He is not exercising lately.	A	Câu A là đúng vì sử dụng đúng cấu trúc phủ định của thì hiện tại hoàn thành tiếp diễn.
5ff500f8-dafb-5f6d-8a47-0aa96298d5e1	677cc65d-415c-5207-bc30-5332b850afae	Choose the correct form: 'She ___ (write) her thesis all year.'	have been writing	has been writing	is writing	writes	B	Câu này cần sử dụng 'has been writing' để diễn tả hành động kéo dài tới hiện tại.
63130b86-7c50-5aba-b933-855d88117950	677cc65d-415c-5207-bc30-5332b850afae	Select the correct sentence.	They are not studying lately.	They has not been studying lately.	They have not been studying lately.	They have not studied lately.	C	Câu A đúng vì sử dụng cấu trúc phủ định của thì hiện tại hoàn thành tiếp diễn.
69bbd91f-71fd-5c3d-80af-159c242be3eb	677cc65d-415c-5207-bc30-5332b850afae	What is the correct answer? '___ you been studying for the test?'	Has	Do	Did	Have	D	Câu này hỏi về hành động đã xảy ra liên tục, nên dùng 'Have' cho 'you'.
6f09370c-2f58-5253-8fca-571ca555e709	677cc65d-415c-5207-bc30-5332b850afae	Select the correct question form.	Have she sung?	Have she been singing?	Has she singed?	Has she been singing?	D	Câu này đúng vì 'Has' được sử dụng cho 'she' để hỏi về hành động đã xây dựng liên tục.
7a7f5f93-23a7-5304-a4c3-aba76e20a833	677cc65d-415c-5207-bc30-5332b850afae	What is the correct form of the verb in this sentence? 'I ___ (wait) for you for an hour.'	waited	has been waiting	have been waiting	am waiting	C	Câu này cần dùng thì hiện tại hoàn thành tiếp diễn, nên sử dụng 'have been waiting'.
9d40faec-3b6e-58ff-9cc5-a826e50bd3bc	677cc65d-415c-5207-bc30-5332b850afae	Identify the error: 'They has been working here since 2019.'	working	here	has	since	C	Câu này sai vì 'They' phải đi với 'have' chứ không phải 'has'.
a5c62bff-dc45-5bde-a6bb-680f1b1cb601	677cc65d-415c-5207-bc30-5332b850afae	Select the correct structure to express the negative.	You have been playing very well.	You have not been playing very well.	You have not played very well.	You are not playing very well.	B	Câu C là đúng vì nó sử dụng cấu trúc phủ định của thì hiện tại hoàn thành tiếp diễn.
c114ce7d-5db9-5121-8375-98cf040766d0	677cc65d-415c-5207-bc30-5332b850afae	Which sentence is correctly using Present Perfect Continuous?	They have been playing soccer for two hours.	They has been playing soccer for two hours.	They are playing soccer for two hours.	They played soccer for two hours.	B	Câu B sai vì 'They' cần sử dụng 'have', không phải 'has'.
eb386f3c-45f8-5b2c-8764-6272be6afee9	677cc65d-415c-5207-bc30-5332b850afae	Which sentence is incorrect?	They have been working hard recently.	They has been working hard recently.	They have not been working hard recently.	Have they been working hard recently?	B	Câu B sai vì 'They' cần sử dụng 'have', không phải 'has'.
03e29687-d291-5237-8a7b-2b4fdc1f70be	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	Last night at 10 p.m., he __________ television.	was watched	is watching	watched	was watching	D	Câu này cần 'was watching' để chỉ hành động đang diễn ra.
129e1973-82dd-5da5-b242-cd87398fdc75	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	What were you __________ at 9 o'clock yesterday?	did	do	doing	done	C	Phải dùng 'doing' để diễn tả hành động đang diễn ra.
1a5a2840-5b01-591b-a004-09781286b974	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	Choose the correct form: They __________ in the park when it started to rain.	was walking	were walking	are walking	walking	B	Dựa vào chủ ngữ 'They', ta dùng 'were walking'.
1a702d34-8d3f-53ea-8c91-45d783681ad3	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	What were they __________ on the weekend?	do	doing	did	does	B	Cần dùng 'doing' cho thì quá khứ tiếp diễn.
216be77a-bf5c-5173-b76a-e8e702cb8199	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	At that moment, I __________ a book.	am reading	was read	was reading	reading	C	Sử dụng 'was reading' để chỉ hành động đang diễn ra.
21c7a50d-6f1a-598e-921c-cd3ca46f095c	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	Which of the following sentences is incorrect?	They were playing soccer.	We wasn't listening to music.	She was reading a book.	I was working all day.	B	'We wasn't' là sai, đúng phải là 'We weren't'.
245a3d34-1897-52d1-b028-a646955a820b	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	When I called her, she __________ her favorite song.	sang	were singing	sings	was singing	D	Sử dụng thì quá khứ tiếp diễn 'was singing' diễn tả hành động đang diễn ra khi có hành động khác.
430512ac-f255-5ebb-9c8c-f48fa721b9e9	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	He __________ up at 7 a.m. every day last week.	was getting	were getting	get	getting	A	'was getting' để chỉ hành động thói quen trong quá khứ.
8b29701d-98c7-5e98-bafe-1cddfaa9361a	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	They __________ always playing video games when I called them.	was	been	are	were	D	Phải dùng 'were' để phù hợp với chủ ngữ 'They'.
9918c983-49ff-5c1d-813d-0f36e684e9b4	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	We __________ for the bus when it started to rain.	were waiting	was waiting	waiting	waited	A	Dùng 'were waiting' để chỉ một hành động đang diễn ra trong quá khứ.
ad374070-4ffb-5481-8329-d00d17893be9	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	He __________ his homework while I was cooking dinner.	was doing	were doing	did	do	A	Sử dụng 'was doing' để chỉ hành động đang xảy ra trong quá khứ.
dd6f1452-3329-52ef-9817-6b32705bd5ce	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	When I saw him, he __________ a new game.	was play	was playing	was played	plays	B	Thì quá khứ tiếp diễn 'was playing' được sử dụng đúng ở đây.
ea8eecc1-b8c2-5aac-8ebc-18d69b604768	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	Which sentence is correct?	I was studying at 8 p.m. last night.	I study at 8 p.m. last night.	I was study at 8 p.m. last night.	I being studied at 8 p.m. last night.	A	Câu này đúng vì thì quá khứ tiếp diễn sử dụng 'was/were + verb-ing'.
f09dc054-8bdf-5fa9-9222-7b2118208e9b	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	They __________ for their exam last night.	studying	was studying	were studying	study	C	'were studying' vì chủ ngữ 'They' cần sử dụng 'were'.
fb187d48-7d99-56de-8d6a-591a16f25302	c24975ca-e5c0-5935-bcf1-6b3a63e197ae	She __________ at home when I arrived.	was sit	sitting	was sitting	sits	C	Câu đúng là 'was sitting' diễn tả hành động đang diễn ra.
019b07e7-7b50-50e1-92e9-41715ae344d3	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	She __________ for two hours before the meeting started.	had been working	has been working	was working	worked	A	Câu này sử dụng thì quá khứ hoàn thành tiếp diễn để nhấn mạnh sự kéo dài của hành động làm việc trước khi cuộc họp bắt đầu.
1ae7b001-36f6-599f-b954-8f38c02f8aea	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	He didn't know that they __________ for weeks before the race.	had trained	had been training	trained	were training	C	Câu này chỉ ra rằng hành động đã diễn ra trước một thời điểm trong quá khứ mà không cần nhấn mạnh sự kéo dài.
2a796c4a-a01f-5b6e-a5c5-39e08f1c89e9	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	They __________ before the game started.	had been training	were training	trained	have trained	B	Đoạn này không nhấn mạnh sự kéo dài, mà chỉ nhắc đến hành động đã xảy ra, vì vậy 'were training' là lựa chọn đúng.
2c79cdc6-e74f-5752-9e11-40633b94cde8	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	She __________ since 8 AM when I called her.	had been studying	was studying	has studied	studied	C	Câu này cần thì quá khứ hoàn thành tiếp diễn để nói về một hành động đã xảy ra liên tục trước khi tôi gọi.
3aa2c0f2-6dc4-5f06-a399-be6fbc7eac78	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	They __________ dinner when the power went out.	had cooked	had been cooking	were cooking	cooked	B	Ở đây, câu cần thì quá khứ hoàn thành tiếp diễn để nhấn mạnh hành động đang diễn ra trước khi sự cố xảy ra.
42ced6bd-fe26-57bc-8272-2fee8111c31d	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	She __________ about the project for months until it was completed.	was working	had been working	worked	have worked	A	Câu này nói về một hành động đã xảy ra mà không cần nhấn mạnh sự kéo dài, do đó 'was working' là đáp án chính xác.
536f1ae7-a6a0-55d9-a150-86ebbaca7417	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	He __________ when I arrived at his house.	had read	had been reading	was reading	reads	D	Câu này cần một hành động đang diễn ra mà không kéo dài trước thời điểm quá khứ, vì vậy 'was reading' là lựa chọn đúng.
5618d053-f9c5-5c9c-a870-994735716287	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	He thought he __________ enough time before the deadline.	have had	had been having	had had	was having	C	Câu này thể hiện một hành động đã xảy ra và cần cách biểu hiện quá khứ đơn giản ở đây.
7751c40a-092f-5ee4-a05f-298663224ff6	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	__________ you __________ for the exam before last week?	Did, study	Had, studied	Had, been studying	Were, studying	C	Trong câu hỏi này, chúng ta cần thì quá khứ hoàn thành tiếp diễn, do đó 'Had been studying' là đáp án chính xác.
8619e3e3-a6d5-526f-bb48-35450909cf54	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	They __________ at the park since 10 AM.	had been playing	were playing	played	have played	B	Câu này yêu cầu thì quá khứ hoàn thành tiếp diễn, vì vậy 'had been playing' là đáp án đúng cho một hành động bắt đầu trước và còn kéo dài.
8b217bc1-4ecf-5b05-9b9e-36e4340d63c7	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	__________ he __________ for his test when the teacher walked in?	Had, been studying	Did, study	Was, studying	Has, studied	D	Câu hỏi cần thì quá khứ tiếp diễn để chỉ hành động đang xảy ra tại thời điểm một sự việc khác diễn ra.
b627b869-194e-5847-8134-c29571cd68a5	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	We __________ for a long time before the storm hit.	had been waiting	waited	were waiting	have waited	D	Vì đây là một trường hợp nhấn mạnh sự đã xảy ra trước sự kiện của bão, nên 'were waiting' là đáp án đúng.
d3c44dcd-0b57-5700-810c-3a3875b0a701	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	I __________ for my friend for over an hour before she called.	had been waiting	was waiting	waited	have waited	A	Câu này nhấn mạnh khoảng thời gian kéo dài chờ đợi trước khi bạn của tôi gọi.
d64e19e0-8c71-51ab-9932-bcc8bae7b64d	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	I __________ for the bus for 30 minutes when it finally came.	had been waiting	was waiting	waited	have waited	A	Câu này cần sử dụng thì quá khứ hoàn thành tiếp diễn để nhấn mạnh thời gian chờ xe buýt.
e40ff1ca-e838-50d7-981a-c7cc687e5c8a	7abedb57-1db4-5e6e-b812-3e01aa6fbd89	They __________ hard before they got the promotion.	had been working	worked	were working	have worked	B	Câu đòi hỏi một hành động đã xảy ra trước một thời điểm trong quá khứ mà không cần nhấn mạnh về khoảng thời gian.
04ad3841-83b1-516a-95e8-db8f05efbc5b	7c73a5c1-62b4-54dc-80c0-314af909f519	What time _____ she _____ her homework tomorrow?	will / be doing	is / doing	will / do	does / do	C	Câu này cần cấu trúc hỏi đúng của thì tương lai tiếp diễn để biết hành động trong tương lai.
091910be-c431-500a-8e4b-5a17e094b2c8	7c73a5c1-62b4-54dc-80c0-314af909f519	She decided that she _____ a book during her trip.	will be reading	reads	read	is reading	B	Câu này sử dụng cấu trúc sai, nên không phù hợp với thì tương lai tiếp diễn.
0cb9815b-4864-5932-872f-915ddc557bef	7c73a5c1-62b4-54dc-80c0-314af909f519	Will they _____ the new policy next week?	be implementing	implementing	will implement	implement	B	Câu hỏi này cần sử dụng thì tương lai tiếp diễn để xác định hành động sẽ xảy ra.
18df256d-b1f9-5c50-a2e3-68c010920557	7c73a5c1-62b4-54dc-80c0-314af909f519	I think we _____ all day tomorrow.	will be working	work	are working	worked	C	Câu này ám chỉ hành động kéo dài liên tục trong một khoảng thời gian của tương lai.
352b95df-c3ff-5b40-8526-a83162dce3dc	7c73a5c1-62b4-54dc-80c0-314af909f519	This time next month, we _____ in Paris.	will be staying	stay	are staying	stayed	A	Câu này diễn tả hành động kéo dài liên tục trong một khoảng thời gian ở tương lai.
4711bc4b-92f8-5623-a759-db856d9822f9	7c73a5c1-62b4-54dc-80c0-314af909f519	The team _____ when the manager arrives.	will be presenting	will present	are presenting	present	D	Câu này sử dụng cấu trúc đúng của thì tương lai tiếp diễn để miêu tả hành động xảy ra với một hành động khác.
59505bab-fe04-5701-aec4-4762e6fdf15b	7c73a5c1-62b4-54dc-80c0-314af909f519	Next week, I _____ my presentation while you are on vacation.	will be finishing	are finishing	finish	will finish	C	Câu này nói về một hành động đang diễn ra và có thể bị gián đoạn bởi hành động khác trong tương lai.
9335f6df-c994-5bd4-bcc2-08ecf605fee2	7c73a5c1-62b4-54dc-80c0-314af909f519	At this time tomorrow, I _____ on the beach.	will be lying	am lying	will lie	lie	A	Câu này sử dụng thì tương lai tiếp diễn để chỉ hành động đang xảy ra tại một thời điểm cụ thể trong tương lai.
9a4fde48-b649-59fc-8848-cc2a07fe77d1	7c73a5c1-62b4-54dc-80c0-314af909f519	What _____ you _____ at this time next week?	will / do	are / doing	will / be doing	do / be	C	Câu hỏi này sử dụng cấu trúc của thì tương lai tiếp diễn để hỏi về hành động sẽ xảy ra trong tương lai.
a411cc5d-143c-53ad-bb42-f58b5bab70df	7c73a5c1-62b4-54dc-80c0-314af909f519	We _____ during the meeting.	won't be talking	talk	aren't talking	will talk	A	Câu này diễn tả rằng hành động không diễn ra trong một khoảng thời gian cụ thể tương lai.
a45d2480-1e17-5357-9b67-33b481a4a7b2	7c73a5c1-62b4-54dc-80c0-314af909f519	The concert _____ at 8 PM tomorrow.	will start	won't be starting	starts	is starting	B	Câu này sử dụng thì tương lai tiếp diễn để diễn tả một hành động không xảy ra tại thời điểm cụ thể trong tương lai.
ad21b077-0d4d-5e37-bd82-52e3f6421bcb	7c73a5c1-62b4-54dc-80c0-314af909f519	They _____ dinner at 7 PM tonight.	won't be serving	aren't serving	serve	won't serve	B	Câu này dùng thì tương lai tiếp diễn để chỉ hành động không xảy ra tại một thời điểm trong tương lai.
bea9e2f3-58b7-5401-a85d-78dd45b9e14a	7c73a5c1-62b4-54dc-80c0-314af909f519	The sun _____ at 6 AM tomorrow.	will be rising	is rising	rises	won't rise	D	Câu này không sử dụng thì tương lai tiếp diễn vì nó nói về một thời điểm chính xác.
d39b8b42-696a-5c33-9941-a8af866585c1	7c73a5c1-62b4-54dc-80c0-314af909f519	She said that they _____ their project when we arrive.	will be completing	are completing	will complete	complete	D	Câu này nói về một hành động tương lai có thể diễn ra song song với hành động khác trong tương lai.
dcf81c21-bd79-5d61-b3e2-4cc1d4852fcc	7c73a5c1-62b4-54dc-80c0-314af909f519	By next year, I _____ my degree for two years.	will be studying	studied	are studying	study	A	Câu này biểu thị một hành động xảy ra và kéo dài liên tục trong một khoảng thời gian ở tương lai.
16d44844-a1c4-5a02-9fb3-030de126aaa8	3e4c58f3-a6b2-5159-9f60-c91694075c7f	She thinks they ___ before the deadline.	will have completed	complete	will complete	has completed	C	Câu này cần sử dụng thì tương lai hoàn thành khi nói về hành động hoàn tất trước thời hạn.
1979058d-31a5-5337-a20b-d522943bd177	3e4c58f3-a6b2-5159-9f60-c91694075c7f	She ___ the report by noon tomorrow.	will finish	will have finished	has finished	finished	D	Câu này sai thì vì cần sử dụng thì tương lai hoàn thành để chỉ ra hành động hoàn tất trước một thời điểm trong tương lai.
238a5a6d-76b6-54fb-ae91-3ab8e4268eb2	3e4c58f3-a6b2-5159-9f60-c91694075c7f	They ___ the project before the deadline.	will have finished	will finish	have finished	finished	A	Dùng thì tương lai hoàn thành để nói đến hành động sẽ hoàn tất trước thời hạn.
3a5bab48-98ec-55e6-85e9-26387d67350e	3e4c58f3-a6b2-5159-9f60-c91694075c7f	By next summer, he ___ English for two years.	will learn	will have learned	learned	has learned	B	Câu này sử dụng thì tương lai hoàn thành để biểu thị hành động kéo dài đến một thời điểm trong tương lai.
5caace35-2ca8-5632-9ed8-fcdfd9cf190f	3e4c58f3-a6b2-5159-9f60-c91694075c7f	We are sure he ___ the presentation by next week.	will have prepared	will prepare	prepared	has prepared	D	Cần sử dụng thì tương lai hoàn thành để diễn tả hành động sẽ hoàn tất trước một thời điểm trong tương lai.
5fa2f988-ab30-560a-837f-aadab01f3d57	3e4c58f3-a6b2-5159-9f60-c91694075c7f	We ___ here for five years by the end of this month.	will have been living	will live	have been living	had lived	C	Chỉ hành động kéo dài đến một thời điểm trong tương lai, sử dụng hiện tại hoàn thành liên quan.
5fd90a74-cf34-59ad-8a1d-c6bebb39c76d	3e4c58f3-a6b2-5159-9f60-c91694075c7f	By next year, I ___ my degree.	will have completed	will complete	have completed	completed	A	Dùng thì tương lai hoàn thành để diễn tả hành động sẽ hoàn tất trước một thời điểm trong tương lai.
6d9503a1-1db7-50b8-b99e-b4f2d794f8bb	3e4c58f3-a6b2-5159-9f60-c91694075c7f	By April, she ___ here for three years.	will have stayed	will stay	has stayed	stayed	A	Sử dụng thì tương lai hoàn thành để chỉ ra hành động kéo dài đến một thời điểm trong tương lai.
7dbd2aa1-d3d4-58bd-a825-6da205c99de7	3e4c58f3-a6b2-5159-9f60-c91694075c7f	When you call her, she ___ her homework.	will have finished	will finish	has finished	finished	B	Cần sử dụng thì tương lai hoàn thành khi theo đúng bối cảnh của câu.
84f82f1c-f4a2-5ad1-8e8f-d3526bdc1baa	3e4c58f3-a6b2-5159-9f60-c91694075c7f	When we arrive, they ___ dinner.	will have had	will have	have had	had	B	Sử dụng thì tương lai hoàn thành để chỉ hành động xảy ra trước một hành động khác trong tương lai.
a85a3141-ba22-58a2-b385-b71180497a47	3e4c58f3-a6b2-5159-9f60-c91694075c7f	They ___ the new house by the time we return.	will have bought	will buy	have bought	bought	C	Cần sử dụng thì tương lai hoàn thành để chỉ rằng hành động sẽ hoàn tất trước khi một hành động khác xảy ra.
b369480f-41d8-5ecc-807d-9491a1e82b7f	3e4c58f3-a6b2-5159-9f60-c91694075c7f	Will they ___ the exam by then?	finish	have finished	finished	been finishing	B	Cần dùng thì tương lai hoàn thành để hỏi về hành động hoàn tất trước một thời điểm cụ thể trong tương lai.
bc4977cc-653c-56e5-ac48-7b60b35140b8	3e4c58f3-a6b2-5159-9f60-c91694075c7f	By next month, they ___ in this city for a year.	lived	will live	live	will have lived	A	Câu này sai thì thì cần sử dụng thì tương lai hoàn thành để chỉ ra hành động kéo dài đến một thời điểm trong tương lai.
d5edb876-b3f8-5ae7-baae-b99316bfcc65	3e4c58f3-a6b2-5159-9f60-c91694075c7f	I know he ___ the project by Friday.	will have started	will start	has started	started	D	Câu này sai thì thì cần sử dụng thì tương lai hoàn thành để chỉ ra hành động hoàn tất trước một thời điểm trong tương lai.
da85155e-a30f-5213-82f5-7217b77bbfa7	3e4c58f3-a6b2-5159-9f60-c91694075c7f	He promises he ___ his work by the time of the meeting.	will have done	does	will do	did	C	Câu này cần sửa lại thành thì tương lai hoàn thành để diễn tả hành động sẽ hoàn tất trước một thời điểm trong tương lai.
131ff79b-aaf6-5ea4-b236-a9168ed1f954	9b450ce6-1482-58b3-a44e-d0168348c140	He ___ on this project for a long time by next December.	won't be working	will have been working	will work	won't have been working	A	Câu này cần sử dụng thể phủ định của thì tương lai hoàn thành tiếp diễn.
1bf0333f-0c55-5bb0-a7e5-06e507b8812c	9b450ce6-1482-58b3-a44e-d0168348c140	By the end of the year, I ___ for this school for 5 years.	will have studying	will have been studying	have studied	will have studied	B	Câu này yêu cầu sử dụng thì tương lai hoàn thành tiếp diễn để nhấn mạnh sự kéo dài của hành động.
34944a19-b0d3-512d-b510-1cf8f4db575f	9b450ce6-1482-58b3-a44e-d0168348c140	Will you ___ for a long time when I arrive?	have been studying	will study	be studying	have studied	C	Câu hỏi yêu cầu sử dụng thì hiện tại tiếp diễn để nhấn mạnh hành động xảy ra khi có một thời điểm nhất định trong tương lai.
45457905-938e-55ed-871c-d133444d2a15	9b450ce6-1482-58b3-a44e-d0168348c140	By this time next year, I ___ for this company for 10 years.	will have been working	will worked	will have worked	have been working	A	Câu này yêu cầu sử dụng thì tương lai hoàn thành tiếp diễn để diễn tả hành động kéo dài đến thời điểm trong tương lai.
45f616bc-5aa4-5d32-b233-053ff2c21c5a	9b450ce6-1482-58b3-a44e-d0168348c140	They ___ for hours by the time the meeting starts.	won't have been waiting	won't waited	won't have waited	will be waiting	B	Câu này cần thể phủ định của thì tương lai hoàn thành tiếp diễn, dùng động từ 'waiting'.
62a035ad-5342-5d42-a269-b665bb390c25	9b450ce6-1482-58b3-a44e-d0168348c140	By April 1st, she ___ in this city since 2020.	will have lived	will be living	will have been living	lived	D	Câu này cần sử dụng thì hiện tại tiếp diễn để hỏi về tình trạng sống ở thành phố đó.
668e647c-a379-5be8-b8ec-b78ea630a93f	9b450ce6-1482-58b3-a44e-d0168348c140	Will he ___ for his exams all day before they start?	will have studied	be studying	have studied	have been studying	A	Câu này yêu cầu sử dụng thì tương lai hoàn thành tiếp diễn.
67f61c50-7b6a-52c7-8fc6-9c541e7a1ff5	9b450ce6-1482-58b3-a44e-d0168348c140	By the end of this month, we ___ related reports for over a year.	have been preparing	will have been preparing	will be preparing	will have prepared	C	Câu này yêu cầu sử dụng thì tương lai hoàn thành tiếp diễn để nhấn mạnh sự kéo dài của hành động.
6c61b3a7-71a8-5b90-a1b9-7374dd13cde6	9b450ce6-1482-58b3-a44e-d0168348c140	They ___ for two years at the end of this semester.	will have been traveling	will have traveled	will travel	will be traveling	C	Câu này yêu cầu thì tương lai hoàn thành tiếp diễn.
7402a308-fe8b-54b8-9548-ef2905735810	9b450ce6-1482-58b3-a44e-d0168348c140	I ___ all day before the event starts.	won't have been working	won't worked	won't be working	won't have worked	B	Câu này cần sử dụng thể phủ định của thì tương lai hoàn thành tiếp diễn.
841fb942-ae89-5f09-9b81-af733e948836	9b450ce6-1482-58b3-a44e-d0168348c140	She ___ English for five years by next June.	will have been learning	has learned	will learn	will be learning	D	Câu này yêu cầu thì tương lai hoàn thành tiếp diễn để diễn tả hành động kéo dài đến một thời điểm trong tương lai.
8d576550-062e-5826-8faa-70a4da602555	9b450ce6-1482-58b3-a44e-d0168348c140	By 2025, we ___ our project for three years.	will have been developing	will be developing	will have developed	have been developing	A	Sử dụng thì tương lai hoàn thành tiếp diễn cho thấy hành động đã bắt đầu trước 2025 và sẽ kéo dài đến thời điểm đó.
aac11d9b-4bf8-5cd9-a04a-83db2b9a0599	9b450ce6-1482-58b3-a44e-d0168348c140	Will they ___ for days when we finally contact them?	have been waiting	have waited	be waiting	waited	D	Câu này cần hỏi về hành động sẽ xảy ra trong tương lai, yêu cầu thì hiện tại tiếp diễn.
c4466fa0-9191-540d-820d-fc55908c3ee6	9b450ce6-1482-58b3-a44e-d0168348c140	They ___ for their office project by next month.	will have worked	have worked	will have been working	will work	C	Câu này sử dụng thì tương lai hoàn thành tiếp diễn để chỉ sự kéo dài đến một thời điểm trong tương lai.
efdad83c-dd8f-5466-bfd4-85a20c3f810e	9b450ce6-1482-58b3-a44e-d0168348c140	I ___ a lot by the time he joins us.	will have been reading	will read	have read	will have read	B	Câu này yêu cầu thì tương lai hoàn thành tiếp diễn để nhấn mạnh sự kéo dài của hành động.
307a710c-d19c-5253-a413-f732b2c8872b	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: The ___ movie made me cry.	tired	tireing	tiring	tires	A	Tính từ 'tired' được hình thành từ 'tire' với đuôi -ed, chỉ cảm xúc của người xem.
3a0dd37f-9584-54da-8a22-d20bc3d9679e	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: The child was ___ by the clown's tricks.	amuseing	amused	amuse	amuses	C	Sử dụng đuôi -ed để chỉ cảm xúc của đứa trẻ sau khi xem hành động.
4ff11c75-7e2f-5700-8033-67a9b96876d7	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: He was ___ by the performance of the band.	impressed	impressing	impress	impresses	A	'Impressed' mô tả cảm xúc của anh ấy khi xem biểu diễn.
606c4a77-30d3-5231-a673-4b915139a351	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: She is very ___ by the movie.	bored	boring	bore	boreing	A	Tính từ 'bored' được hình thành từ 'bore' với đuôi -ed để chỉ cảm xúc của người xem.
6bb6cd22-49dd-58e4-8208-ba96befad68f	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: This puzzle is ___ and difficult to solve.	puzzled	puzzle	puzzling	puzzleing	C	Tính từ 'puzzling' được hình thành từ 'puzzle' với đuôi -ing để chỉ tính chất của câu đố.
6c5cfd1d-79ca-57c0-bb2c-83482acfbde4	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: She found the lecture very ___.	boring	bored	bore	boreing	B	Tính từ 'boring' được dùng để chỉ tính chất của bài giảng chứ không phải cảm xúc.
715e012e-575c-5044-9853-f81318c125c1	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: The test was very ___.	frustrating	frustrated	frustrates	frustrate	D	'Frustrating' diễn tả cảm giác của người làm bài test.
7412dcd0-d674-59b0-9cc0-5cdbd1c96764	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: The news was quite ___.	surprising	surprise	surprised	surpriseing	D	'Surprising' mô tả tính chất của tin tức.
9d29c704-2b82-5ecb-a92c-03677fbf0149	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: The homework is ____ to complete.	bore	boring	bored	boreing	B	'Boring' mô tả tính chất của bài tập về nhà.
9fa52862-2e98-510e-a267-010eab666028	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: I felt ___ after finishing the project.	excitement	excited	exciting	excite	C	'Excited' mô tả cảm xúc của tôi sau khi hoàn thành dự án.
a4a2d6fe-3b8a-5f4b-b4ac-46dbef805a8f	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: The story was very ___.	boreing	boring	bore	bored	A	'Boring' mô tả tính chất của câu chuyện.
a8d0b593-1ccd-5529-be7f-2a1f153dba0d	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: Her decision was quite ___.	surprising	surprised	surprise	surpriseing	C	'Surprising' mô tả tính chất của quyết định.
d431336c-553f-5b7a-994f-f1b616bd491c	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: They were ___ by the unexpected news.	surprising	surprised	surprise	surprisedly	B	'Surprised' chỉ cảm xúc của họ khi nghe tin.
d4cf33ef-dcf4-59f4-b276-c642e780521d	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: The child is ___ with the toy.	amusing	amused	amuse	amuseing	D	Tính từ 'amused' được hình thành từ 'amuse' với đuôi -ed, diễn tả cảm xúc của đứa trẻ.
f9b50055-0a6c-5cd3-845f-c6af382d1e5c	a4511b06-c5a0-5163-8335-feb66d5e380f	Choose the correct form: The students are ___ by the teacher's explanation.	exciting	excited	excite	excitingly	B	Tính từ 'excited' được hình thành từ 'excite' với đuôi -ed để chỉ cảm xúc của sinh viên.
09101060-54ee-5dab-b100-889236153fd5	46d82477-1213-514c-8626-f57444ccb50b	The teacher said that the students ___ (pass) the exam.	were passing	had passed	pass	will pass	A	Câu nói gián tiếp sử dụng thì quá khứ cho mệnh đề chính, do đó mệnh đề phụ cần động từ ở dạng quá khứ 'were passing'.
0e6ca121-ffc4-5d16-996a-2199b0b1568a	46d82477-1213-514c-8626-f57444ccb50b	If he ___ (study) harder, he would pass the exam.	studies	studied	has studied	will study	A	Câu này sử dụng thì hiện tại trong mệnh đề chính để diễn tả điều kiện giả định. Nếu động từ trong mệnh đề phụ là 'study' thì động từ chính sẽ là 'studies'.
1b6998d6-3157-5cc7-82ec-a668ef7f5a5a	46d82477-1213-514c-8626-f57444ccb50b	He always feels tired because he ___ (work) late.	worked	was working	is working	works	D	Mệnh đề chính dùng thì hiện tại đơn để thể hiện thói quen và cần động từ 'works' cho sự phối hợp hợp lý.
2345fdb6-2c6c-5433-8dcb-4774b5c43f49	46d82477-1213-514c-8626-f57444ccb50b	When I was a child, I ___ (want) to be a pilot.	wanted	wants	want	was wanting	A	Mệnh đề này sử dụng thì quá khứ đơn để thể hiện ước mơ trong quá khứ, và 'wanted' là chính xác.
29d49c94-de2e-51fb-b1ac-9f762fd86c79	46d82477-1213-514c-8626-f57444ccb50b	I will call you when I ___ (arrive) at the airport.	arrived	arrive	have arrived	was arriving	C	Câu này sử dụng thì hiện tại hoàn thành trong mệnh đề phụ để diễn tả hành động xảy ra trong tương lai sau hành động khác.
2b085c58-cbe3-589c-9031-cbcb9ad6c122	46d82477-1213-514c-8626-f57444ccb50b	She said she ___ (finish) the project by next week.	finishes	would finish	finished	has finished	B	Mệnh đề phụ được chia theo thì quá khứ, vì vậy động từ chính cần sử dụng thì sẽ là 'would finish' để thể hiện tương lai trong quá khứ.
68242dd0-e5d3-5c0d-9fff-3c3f4ba073ac	46d82477-1213-514c-8626-f57444ccb50b	They were surprised that she ___ (win) the competition.	had won	wins	winning	won	D	Mệnh đề này sử dụng thì quá khứ vì nó diễn tả một sự việc đã xảy ra trong quá khứ.
6b29f4be-19c7-5c69-a191-1f7d4383a64c	46d82477-1213-514c-8626-f57444ccb50b	He would buy a car if he ___ (have) enough money.	will have	have	had	has	C	Mệnh đề điều kiện loại 2 yêu cầu thì quá khứ, do đó động từ 'had' là chính xác.
8bebbc08-3e8c-58a6-8904-86dffe1c208d	46d82477-1213-514c-8626-f57444ccb50b	I knew that he ___ (be) a great musician.	would be	is	has been	was	D	Mệnh đề chính và phụ đều cần sử dụng thì quá khứ, vì vậy 'was' là động từ chính xác.
a72f873c-3f8e-5e7a-adff-5542fe0829d9	46d82477-1213-514c-8626-f57444ccb50b	She will come to the party as soon as she ___ (finish) her homework.	has finished	finished	finishes	is finishing	C	Câu này sử dụng thì hiện tại đơn cho hành động trong tương lai theo sau mệnh đề điều kiện.
d0a5e0c4-0f3b-5682-ae5d-b75188387289	46d82477-1213-514c-8626-f57444ccb50b	She will still be happy if he ___ (come) late.	came	comes	has come	will come	B	Mệnh đề này yêu cầu thì hiện tại đơn 'comes' để diễn tả sự thật có thể xảy ra trong tương lai.
e8c4f2c8-caeb-5225-b02c-3ab5d78c05c9	46d82477-1213-514c-8626-f57444ccb50b	I hope that you ___ (enjoy) your trip.	enjoy	enjoys	enjoyed	are enjoying	A	Mệnh đề phụ cần sử dụng thì hiện tại đơn 'enjoy' để diễn tả sự hy vọng.
ea68d6f8-d912-5560-85d7-621adb034f45	46d82477-1213-514c-8626-f57444ccb50b	They will start the meeting once everyone ___ (arrive).	arrived	arrives	have arrived	was arriving	B	Hành động trong mệnh đề phụ cần sử dụng thì hiện tại đơn 'arrives' cho sự phối hợp hợp lý.
ebaa7d0f-1020-50f3-996a-fbd0b33fd092	46d82477-1213-514c-8626-f57444ccb50b	I was happy because I ___ (win) the lottery.	have won	win	won	was winning	C	Câu này sử dụng thì quá khứ đơn 'won' cho mệnh đề phụ diễn tả lý do trong quá khứ.
eff777f4-d6c4-50f0-8858-079cca428863	46d82477-1213-514c-8626-f57444ccb50b	If I ___ (be) you, I would take that job.	am	were	was	be	B	Mệnh đề điều kiện loại 2 yêu cầu sử dụng 'were' với tất cả các chủ ngữ để chỉ điều ngược lại với thực tế.
086d08e5-0b86-57ae-9658-7ebe1cc582e8	7758c99d-e984-5e34-8688-bc2cb14b6650	If only I __ a little taller.	wasn't	am	were	is	B	Dùng 'were' khi ước muốn điều không có thật hoặc ngược lại ở hiện tại.
2cda529b-cc29-5f34-b6ad-f3e791a97ea2	7758c99d-e984-5e34-8688-bc2cb14b6650	If only he __ to the party yesterday.	comes	came	was coming	had come	D	Dùng 'had come' để diễn tả ước muốn về một điều đã xảy ra trong quá khứ.
3c9aabbc-75d2-54c6-887e-180258871df8	7758c99d-e984-5e34-8688-bc2cb14b6650	I wish I __ swim better.	can	may	could	must	C	Sử dụng 'could' để diễn tả mong ước về khả năng hiện tại.
55240e5a-805b-5aba-ae4b-dbafbb98dc5c	7758c99d-e984-5e34-8688-bc2cb14b6650	I wish my brother __ play the guitar.	can	may	could	must	C	Sử dụng 'could' để diễn tả mong ước về khả năng hiện tại.
627fc83a-952a-5516-b927-00cddc7e06ff	7758c99d-e984-5e34-8688-bc2cb14b6650	I wish they __ the news before the meeting.	don't hear	didn't hear	hadn't heard	had heard	C	Dùng 'hadn't heard' để diễn tả mong ước về một điều đã xảy ra trong quá khứ.
694fc710-2b39-5495-b3ca-4d395a1c4b35	7758c99d-e984-5e34-8688-bc2cb14b6650	If only you __ study harder for the exam.	would	not	didn't	could	D	Dùng 'would' để bày tỏ mong ước cho tương lai.
6bf41c57-2c83-5afd-ad39-9a22e3372125	7758c99d-e984-5e34-8688-bc2cb14b6650	If only I __ more time to finish my project.	have	had	has	having	B	Dùng thì quá khứ đơn 'had' để diễn tả ước muốn không có thật trong hiện tại.
7791d8df-ace0-5678-aea9-b76bf57b56ca	7758c99d-e984-5e34-8688-bc2cb14b6650	I wish you __ to my birthday next year.	would come	came	come	will come	A	Sử dụng 'would' để diễn tả mong muốn cho tương lai.
8533cb7a-86a2-561f-9e16-43fbff9c251d	7758c99d-e984-5e34-8688-bc2cb14b6650	If only they __ been more responsible last year.	would	didn't	could	had	D	Dùng 'had' để diễn tả ước muốn về một điều đã xảy ra trong quá khứ.
bd200c58-77da-5295-aea1-fef49c64c4cd	7758c99d-e984-5e34-8688-bc2cb14b6650	I wish I __ been at the wedding last week.	had	could have	was	were	A	Sử dụng 'had' để diễn tả ước muốn về quá khứ.
cd47957e-4741-5fd8-b541-3318dbae0ced	7758c99d-e984-5e34-8688-bc2cb14b6650	If only he __ the right decisions at that time.	makes	had made	would make	made	B	Dùng 'had made' để diễn tả mong ước về một điều đã xảy ra trong quá khứ.
da62e870-a47d-5fed-89eb-9f9ecfa8d01f	7758c99d-e984-5e34-8688-bc2cb14b6650	I wish she __ the concert with us next week.	would join	joins	joined	has joined	A	Sử dụng 'would' để diễn tả ước muốn cho tương lai.
f62bbe76-9683-50c9-9e50-a8dddb7edd0c	7758c99d-e984-5e34-8688-bc2cb14b6650	I wish you __ to see me more often.	came	come	would come	have come	A	Sử dụng 'came' để diễn tả mong ước không có thật trong hiện tại.
f646e6f6-d0ef-54d8-aa8d-7a88abbd67fd	7758c99d-e984-5e34-8688-bc2cb14b6650	If only she __ that movie with me.	watched	had watched	would watch	watches	B	Dùng 'had watched' để diễn tả mong ước về một điều đã xảy ra trong quá khứ.
fb559421-6087-5db7-81b5-bf5a0b86c99a	7758c99d-e984-5e34-8688-bc2cb14b6650	I wish I __ not have to work this weekend.	do	would	did	have	C	Dùng 'did' để bày tỏ mong ước về một điều không có thật trong hiện tại.
03cc5163-1254-5130-b64a-8e472cd7654b	729c62be-cf33-589b-8a56-ef071df9b87c	He has ____ experience to handle the project.	such	many	enough	too	C	'Enough' được dùng sau tính từ để chỉ khả năng hoặc đủ điều kiện.
181eb592-3d51-58d2-802d-ab98adcd3f0f	729c62be-cf33-589b-8a56-ef071df9b87c	He is ____ short to reach the top shelf.	too	enough	so	such	A	Dùng 'too' trước tính từ để chỉ mức độ, nghĩa là không đủ.
279c9855-872a-5807-b42b-2a24aab88072	729c62be-cf33-589b-8a56-ef071df9b87c	This exercise is ____ difficult for beginners.	so	too	such	enough	B	'Too' được dùng trước tính từ để chỉ mức độ không đủ.
42e12cb8-eb00-5f8e-92aa-eb8fe6a573e7	729c62be-cf33-589b-8a56-ef071df9b87c	The movie was ____ interesting that we watched it twice.	too	such	so	enough	C	Cấu trúc 'so ... that' dùng để chỉ kết quả.
5e1a8c72-0558-5bda-b979-87882a9f720d	729c62be-cf33-589b-8a56-ef071df9b87c	It was ____ a nice day that we went for a picnic.	too	enough	so	such	D	'Such ... that' được dùng với danh từ để chỉ kết quả.
64406e7e-fb23-5457-9429-7ca4a64ebfbc	729c62be-cf33-589b-8a56-ef071df9b87c	It was ____ cold that we stayed indoors all day.	enough	too	such	so	D	'So ... that' chỉ rõ ràng kết quả của hành động.
7c7c635f-bf30-5386-a136-5e8f730e675e	729c62be-cf33-589b-8a56-ef071df9b87c	She is ____ a good friend that I trust her completely.	too	such	enough	so	D	'Such ... that' dùng để chỉ mức độ và kết quả.
7e09be96-ea0f-582d-87fb-1e9865ca328d	729c62be-cf33-589b-8a56-ef071df9b87c	He is strong ____ lift the heavy box.	many	enough	so	too	B	'Enough' đứng sau tính từ để chỉ mức độ.
a048b67d-adb1-593d-8959-de99a6250416	729c62be-cf33-589b-8a56-ef071df9b87c	There were ____ few options left by the time we arrived.	too	enough	such	so	B	'Enough' dùng trong trường hợp không có đủ lựa chọn.
a4b6ccc5-ba00-5c0b-b8cb-10024ffc7495	729c62be-cf33-589b-8a56-ef071df9b87c	She didn’t study ____ to pass the exam.	too	enough	so	such	B	'Enough' được dùng sau trạng từ để chỉ mức độ cao.
af8c09a0-f5e3-598f-88ce-d515d2e79c2d	729c62be-cf33-589b-8a56-ef071df9b87c	The lecture was ____ boring that several students fell asleep.	too	enough	so	such	C	'Such ... that' chỉ rõ kết quả của trạng thái.
b6847ab6-aabf-530e-a3d8-3751421a6cd5	729c62be-cf33-589b-8a56-ef071df9b87c	They were ____ hungry that they ate everything.	so	too	enough	such	A	'So ... that' dùng để chỉ kết quả rất rõ ràng.
b7408a2e-eae3-5868-b849-0dd6f13f5e50	729c62be-cf33-589b-8a56-ef071df9b87c	She had ____ little time to finish the job.	too	enough	so	such	A	'Too' được dùng để chỉ mức độ không đủ.
d70f6406-09ac-55db-94e5-ae7210ee624e	729c62be-cf33-589b-8a56-ef071df9b87c	The cake is ____ sweet for my preference.	too	so	enough	such	A	'Too' đứng trước tính từ để chỉ mức độ không đủ.
ef5066ae-7cb9-5dc3-8247-ae722effccc3	729c62be-cf33-589b-8a56-ef071df9b87c	There were ____ many people that we couldn't find a seat.	too	enough	so	such	C	'So many ... that' là cấu trúc chỉ kết quả.
033d418a-320f-5263-ae68-ccfac3d39910	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	Select the adjective form of 'friendliness':	friendly	friendful	friend-like	friends	D	Tính từ được hình thành từ danh từ 'friendliness' qua hậu tố '-ly'.
171abe28-c47b-5f6f-8746-b606a3e6e046	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	What is the adjective form of the noun 'wealth':	wealthy	wealthness	wealthlike	wealthful	D	Tính từ được hình thành từ danh từ 'wealth' qua hậu tố '-y'.
1a4afcdd-81b1-5b22-a2e0-24f477100ea8	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	Choose the correct adjective form of the noun 'fame':	famous	fameful	famelike	famely	B	Tính từ 'famous' được hình thành từ danh từ 'fame' bằng cách thêm hậu tố '-ous'.
8291005f-e2e6-5da2-a196-05f6a3b75e89	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	Choose the correct noun form of the verb 'to teach':	teaching	teacher	teaches	teachful	C	Danh từ 'teacher' được hình thành từ động từ 'teach' bằng cách thêm hậu tố '-er'.
8649b117-cc63-550e-8e5f-48ba11fe0e3c	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	Choose the correct noun form of 'to drain':	drainage	draining	drainer	drainable	A	Danh từ 'drainage' được hình thành từ động từ 'drain' qua hậu tố '-age'.
9085a838-14fa-57e3-b0ee-65078742f6ad	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	Select the adjective form of the noun 'friend':	friendly	friendship	friends	friendliness	B	Tính từ được hình thành từ danh từ 'friend' bằng cách thêm hậu tố '-ly'.
99e71ea7-e12f-5936-8b73-1a8e96cb48e0	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	What is the adjective form of the noun 'danger'?	dangerous	dangerousness	dangerful	dangers	B	Hậu tố '-ous' được thêm vào danh từ 'danger' để thành lập tính từ.
a37a7038-b8fc-5a8c-9f3c-a51fac7e8211	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	What is the noun form of the verb 'to develop'?	development	developing	developed	developer	C	Hậu tố '-ment' được thêm vào động từ 'develop' để thành lập danh từ.
a745f03b-6f9e-5461-8d97-09ede9a9f0e3	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	What is the noun form of 'to inspire'?	inspiring	inspired	inspiration	inspirer	C	Danh từ 'inspiration' được hình thành từ động từ 'inspire' bằng cách thêm hậu tố '-ation'.
b54971a1-499c-5005-b472-8565a026565d	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	Choose the correct noun form of the verb 'to create':	creation	creative	creator	creating	A	Danh từ được hình thành từ động từ 'create' bằng cách thêm hậu tố '-ion'.
be92f33a-9ae9-5046-a071-7c71bc826cc6	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	Select the correct noun form from the verb 'to exist':	existence	existing	exists	existed	A	Danh từ 'existence' được hình thành từ động từ 'exist' bằng cách thêm hậu tố '-ence'.
d66a962f-6867-55c4-b3e8-829746dd79c7	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	Choose the correct adjective form of 'history':	historical	historically	historian	historyful	D	Tính từ được hình thành từ danh từ 'history' bằng cách thêm hậu tố '-ic'.
d768f79c-d230-5aff-a11c-045b84624b3c	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	Select the correct noun form from the verb 'to act':	action	active	actful	actor	C	Danh từ 'action' được hình thành từ động từ 'act' bằng cách thêm hậu tố '-ion'.
e421ba61-5a35-50d6-8832-c4cb17c837d1	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	What is the noun form of the verb 'to employ'?	employee	employment	employmentful	employer	A	Danh từ 'employee' được hình thành từ động từ 'employ' bằng cách thêm hậu tố '-ee'.
fdabdb3a-b11e-51ff-9147-6afaaf5262d7	9e7d8e8a-9fc8-5389-80a9-3b947a40847d	Select the adjective form from 'danger':	dangerably	dangersome	dangerous	dangerlike	B	Tính từ 'dangerous' được hình thành từ danh từ 'danger' bằng cách thêm hậu tố '-ous'.
036396ce-692e-5c4c-a2f3-7ca0ce91415d	e27111fd-7f8a-5e57-9ce9-273d448baf33	He decided to leave __________ he was very tired.	but	although	since	and	C	'Since' là liên từ chỉ lý do để diễn tả nguyên nhân.
0694e454-3006-59bc-9d25-c0db374ef996	e27111fd-7f8a-5e57-9ce9-273d448baf33	He hasn't got __________ money to buy a car.	enough	many	much	a lot of	B	'Many' không đúng với danh từ không đếm được 'money'.
0cfd126d-ec9b-5820-a8bb-ef377a9ebf61	e27111fd-7f8a-5e57-9ce9-273d448baf33	Her dress is __________ beautiful.	too	enough	very	more	A	Trạng từ 'too' được dùng để nhấn mạnh tính từ 'beautiful'.
20d4c679-a9b7-50e4-9890-2a799d8e1456	e27111fd-7f8a-5e57-9ce9-273d448baf33	His performance was __________ than last year.	bad	worse	worst	more bad	A	'Bad' là hình thức chính xác nhưng không phải so sánh.
3f0a4de4-716e-5513-9a20-5a20d232858a	e27111fd-7f8a-5e57-9ce9-273d448baf33	The children cleaned their room __________.	quicker	quickly	quick	quickest	A	Trạng từ 'quickly' miêu tả cách diễn ra hành động 'cleaned'.
45362794-ec92-5916-b243-8962fc615c7f	e27111fd-7f8a-5e57-9ce9-273d448baf33	The teacher gave a very __________ lecture.	interesting	interest	interestingly	interested	A	Tính từ 'interesting' đứng trước danh từ 'lecture' để mô tả nó.
5135d08a-fb93-5618-a03c-6e4e1ade788f	e27111fd-7f8a-5e57-9ce9-273d448baf33	They were __________ excited about the trip.	not	no	never	none	C	'Never' là trạng từ được dùng để phủ định sự phấn khích.
616012ed-6b20-5a79-aa20-09f0bc007d97	e27111fd-7f8a-5e57-9ce9-273d448baf33	He reads books __________ than his friends.	fast	fastest	faster	more fast	C	Trạng từ 'faster' là hình thức so sánh hơn của 'fast'.
654e6c33-2cd4-5f87-95ac-7b2cbfc4b314	e27111fd-7f8a-5e57-9ce9-273d448baf33	She could not speak because she was __________ shocked.	very	many	much	too	D	'Too' nhấn mạnh rằng mức độ sốc đã vượt quá khả năng nói.
7bf900c1-af56-574b-8ae0-c1910da35357	e27111fd-7f8a-5e57-9ce9-273d448baf33	He is a __________ person.	kindness	kindly	kind	kinder	B	Tính từ 'kind' được sử dụng để mô tả danh từ 'person'.
8c5f4fd1-35dd-5b7d-82e0-eef7e5e835a4	e27111fd-7f8a-5e57-9ce9-273d448baf33	She speaks __________ English fluently.	good	well	better	best	D	Trạng từ 'well' mô tả cách nói của cô ấy.
906b8a65-9d43-54d0-a629-b105642a0dd5	e27111fd-7f8a-5e57-9ce9-273d448baf33	This is the __________ book I have ever read.	most	more	much	many	C	'Most' là hình thức đúng để chỉ số lượng nhất.
a7df9fa6-0f7f-50be-bb84-3e1cead60e1c	e27111fd-7f8a-5e57-9ce9-273d448baf33	The movie was __________ than I expected.	good	bad	the best	better	D	'Better' là hình thức so sánh hơn của 'good'.
c12ea072-5756-5549-b8f3-b9bae8cf7af9	e27111fd-7f8a-5e57-9ce9-273d448baf33	This is __________ important lesson for all of us.	a	an	the	some	B	'An' được sử dụng trước danh từ bắt đầu bằng nguyên âm 'important'.
f673e85a-96ab-5c27-a8e2-356e4a4d56ab	e27111fd-7f8a-5e57-9ce9-273d448baf33	She is an __________ dancer.	amazement	amazing	amazingly	amaze	B	Tính từ 'amazing' được sử dụng trước danh từ 'dancer'.
07332cf6-7089-57bc-8643-2ec1c5967129	47087e51-2418-596d-ac36-dd23bcfd7310	Choose the option that fits: 'I am very excited and I really ______ to my vacation next month.'	look forward	get over	turn up	bring in	A	'Look forward to' được sử dụng đúng để diễn tả sự mong đợi.
2354f313-4e23-5bb0-9b76-5bd6c959c954	47087e51-2418-596d-ac36-dd23bcfd7310	Choose the correct phrasal verb to complete the sentence: 'My computer keeps _____.'	looking forward	bringing in	turning out	breaking down	D	'Breaking down' có nghĩa là hỏng hóc.
295b00a1-c781-596a-9c70-d4ac48731194	47087e51-2418-596d-ac36-dd23bcfd7310	Choose the correct phrasal verb: She needs to ___ her problems before moving forward.	turn down	get over	break down	call in	B	'Get over' có nghĩa là vượt qua.
2c2555d8-2ba5-58f3-beaf-f91f678e1f5e	47087e51-2418-596d-ac36-dd23bcfd7310	What does 'turn up' mean in this sentence: 'He usually turns up late for meetings.'?	đến	rời khỏi	quay lại	bắt đầu	A	'Turn up' có nghĩa là đến, xuất hiện.
3170ac6e-00c4-55e7-aaf4-0b930a24546e	47087e51-2418-596d-ac36-dd23bcfd7310	Which sentence is an example of a transitive phrasal verb?	The light went out.	He tore it up.	They fell out.	She broke down.	B	'Tore it up' là câu phrasal verb ngoại động từ vì có tân ngữ.
5a486ec6-d3f1-5790-8a51-2e991eb0983c	47087e51-2418-596d-ac36-dd23bcfd7310	Which of the following sentences is incorrect?	She tore up the letter.	They called in for a chat.	I look forward to see you.	He broke down last week.	C	Ở đây, 'look forward to' phải theo sau bởi danh từ hoặc động từ thêm đuôi -ing.
76e7ada8-7a20-50c5-b004-cf675e5d1d2d	47087e51-2418-596d-ac36-dd23bcfd7310	What does 'fall out' mean in the context of an argument?	tránh ra	mờ nhạt	không liên quan	cãi nhau	D	'Fall out' có nghĩa là cãi nhau.
7c508f3f-8a89-5b0c-978b-8bbed9430f73	47087e51-2418-596d-ac36-dd23bcfd7310	Which option correctly completes this sentence? 'After the argument, they didn't talk but eventually _____.'	got over	turned up	broke down	called in	A	'Got over' có nghĩa là khắc phục, vượt qua mâu thuẫn.
89523629-5d49-553d-a07b-cb58b94b0f0a	47087e51-2418-596d-ac36-dd23bcfd7310	Which sentence uses the phrasal verb correctly?	They broke down the car.	He turned up the book.	The school will bring in a consultant.	She fell out her friend.	C	'Bring in' có nghĩa là giới thiệu, được sử dụng đúng ngữ cảnh.
cdf2ebef-1bf7-5bb7-ad0b-c362e7f54a20	47087e51-2418-596d-ac36-dd23bcfd7310	Which of the following is a correct use of 'bear out'?	I will look out.	He will bear out the truth.	They fell out quickly.	She broke down the door.	B	'Bear out' có nghĩa là xác nhận, chứng thực.
d1f9f160-b9d0-5a93-a87a-716919e8cee2	47087e51-2418-596d-ac36-dd23bcfd7310	In the sentence 'He will account for his late arrival', what does 'account for' mean?	tránh khỏi	quay lại	giải thích	bỏ qua	C	'Account for' có nghĩa là giải thích nguyên nhân.
e587fec7-b52e-5677-8c44-d758132f52ab	47087e51-2418-596d-ac36-dd23bcfd7310	Which sentence correctly uses 'take off'?	She took off early in the morning.	He takes off his homework.	Please take off your shoes.	They took off the wall.	C	'Take off' có nghĩa là cởi ra, thường được sử dụng trong ngữ cảnh này.
e9941c1b-72cb-5b39-b97c-9fbbbc8ffa29	47087e51-2418-596d-ac36-dd23bcfd7310	What does 'look forward to' imply in the sentence: 'I look forward to meeting you'?	gặp lại	trốn tránh	đi ra ngoài	mong đợi	D	'Look forward to' có nghĩa là mong đợi điều gì đó.
ef548559-621b-556e-87c6-e6402dc62100	47087e51-2418-596d-ac36-dd23bcfd7310	What does 'call in' mean when someone says, 'Please call in if you need help'?	ghé qua	trốn tránh	từ chối	tìm kiếm	A	'Call in' có nghĩa là ghé thăm hoặc đến một nơi nào đó.
f3f66d82-e1a0-5685-84c6-7e2a12d119b7	47087e51-2418-596d-ac36-dd23bcfd7310	Choose the correct phrasal verb: The meeting was very long, but we managed to ___ all the topics.	fall out	keep on	bear out	bring in	B	'Keep on' có nghĩa là tiếp tục.
02f7fc58-cbeb-5e8f-a472-beac85975744	6a382e0b-06df-53ff-8b14-0e1753d63239	She is very interested ___ learning new languages.	in	about	on	for	A	Cụm "interested in" là một cụm tính từ thường gặp trong tiếng Anh.
0409ccf5-b559-55ae-bc2c-9435d3189f08	6a382e0b-06df-53ff-8b14-0e1753d63239	I look forward ___ your response.	of	for	to	about	B	Cụm "look forward to" chỉ sự mong đợi điều gì đó xảy ra.
0e9820c4-e667-5b0d-9dbb-6823e2fdd9cf	6a382e0b-06df-53ff-8b14-0e1753d63239	He apologized ___ his mistake last week.	for	to	about	with	C	Động từ "apologize" thường đi kèm với "for" khi nói về điều gì đó chúng ta đã làm sai.
1caf1014-a8cb-5f10-bf7e-f317c200d7ae	6a382e0b-06df-53ff-8b14-0e1753d63239	They are committed ___ improving their skills.	of	to	in	for	B	Cụm "committed to" diễn tả sự cam kết đối với điều gì đó.
3a4211ae-da36-5fa8-b39f-08933020e3bc	6a382e0b-06df-53ff-8b14-0e1753d63239	She was ashamed ___ her behavior during the meeting.	of	about	with	to	A	Tính từ "ashamed" đi kèm với giới từ "of".
4ad36835-c069-5a7c-a001-a30495c9e3cd	6a382e0b-06df-53ff-8b14-0e1753d63239	Is there any solution ___ this issue?	to	for	about	at	C	Câu hỏi này sử dụng "solution to" để chỉ ra giải pháp cho vấn đề.
864a772a-66b9-52e9-828f-20b7feb1b0ee	6a382e0b-06df-53ff-8b14-0e1753d63239	This solution is the best ___ our problem.	for	to	on	at	B	Danh từ "solution" thường đi kèm với giới từ "to".
86e2a7c9-1370-5332-91c3-cde2f211b347	6a382e0b-06df-53ff-8b14-0e1753d63239	He doesn't care ___ what people say about him.	of	about	to	with	C	Cấu trúc "care about" diễn tả sự quan tâm.
a54af4b4-1282-5764-b468-01666b83c2b4	6a382e0b-06df-53ff-8b14-0e1753d63239	His advantage ___ speaking multiple languages helped him find a job.	with	in	over	for	C	Danh từ "advantage" đi kèm với giới từ "over" khi so sánh với điều gì đó.
b4f05132-2264-5860-b9fa-79cf22bb8d04	6a382e0b-06df-53ff-8b14-0e1753d63239	She is confident ___ her ability to succeed.	on	with	in	about	D	Tính từ "confident" thường đi kèm với "in" khi nói về sự tin tưởng vào khả năng của ai đó.
bed0d16b-307e-53a1-9ecd-0c13ec6e58d9	6a382e0b-06df-53ff-8b14-0e1753d63239	The book is full ___ interesting facts.	from	of	about	to	D	Cụm "full of" thường sử dụng khi đề cập đến điều gì đó chứa đầy cái gì.
c25a6323-e418-5c1d-9e80-9abcbb169cd5	6a382e0b-06df-53ff-8b14-0e1753d63239	They are good ___ solving complex issues.	about	for	to	at	D	Cụm "good at" là cấu trúc thường dùng khi nói về khả năng.
cafb085c-87c2-537a-b843-8177c5d93d96	6a382e0b-06df-53ff-8b14-0e1753d63239	I am afraid ___ losing my job.	of	for	about	at	A	Tính từ "afraid" đi kèm với giới từ "of".
e0460a41-f82f-5bce-ba80-ef1a408112bc	6a382e0b-06df-53ff-8b14-0e1753d63239	She has a close relationship ___ her colleagues.	with	among	to	for	B	Danh từ "relationship" cần giới từ "with" để chỉ mối quan hệ giữa hai bên.
ea9f1239-124d-53e8-8733-ec55e655c49a	6a382e0b-06df-53ff-8b14-0e1753d63239	He is responsible ___ managing the team.	for	to	with	of	A	Động từ "responsible" đi kèm với giới từ "for".
1517bcdd-e107-5372-b832-a3419992747a	365339d5-8348-5014-974d-fcb051a9bc25	Choose the correct conjunction to complete the sentence: I wanted to go to the party, ____ I was too tired.	but	and	or	so	A	Sử dụng 'but' để thể hiện sự trái ngược giữa việc muốn đi và cảm giác mệt mỏi.
1a14e2ed-8051-5651-a2e6-1198b01fb625	365339d5-8348-5014-974d-fcb051a9bc25	Select the proper conjunction: I like swimming, ____ I don’t like running.	and	but	so	or	B	'But' thể hiện sự đối lập giữa việc thích bơi và không thích chạy.
32b16752-4206-5062-a4c3-cd6d1bab52f4	365339d5-8348-5014-974d-fcb051a9bc25	Choose the right conjunction: She is very talented, ____ she is also very humble.	or	so	but	and	D	'And' được dùng để nối hai ý tích cực.
43b84ca6-6a82-5771-ae35-1b8aee3e71bd	365339d5-8348-5014-974d-fcb051a9bc25	She didn’t see the movie, ____ she had read the book.	although	if	because	but	D	'But' được dùng để chỉ sự mâu thuẫn giữa việc không xem phim và đã đọc sách.
4ab25b45-0aec-5bf9-a7de-0136ab94d59a	365339d5-8348-5014-974d-fcb051a9bc25	Identify the correct subordinating conjunction: I will go to the park ____ it is sunny.	if	when	because	although	A	'If' chỉ điều kiện về thời tiết khi đi công viên.
63848c42-03a7-5c6f-bf3c-73756e53ab3e	365339d5-8348-5014-974d-fcb051a9bc25	Fill in the blank: I will call you ____ I get home.	because	when	if	so	C	'When' dùng để chỉ thời điểm xảy ra hành động.
6d93bf47-dddb-5293-ac31-23a7440be49a	365339d5-8348-5014-974d-fcb051a9bc25	What’s the best subordinating conjunction? Study hard, ____ you will succeed.	if	in order that	because	although	C	'Because' chỉ ra lý do cho việc thành công.
6e2aa878-4241-5c90-b801-627cc9d19577	365339d5-8348-5014-974d-fcb051a9bc25	What should be the conjunction here? He was late, ____ he missed the bus.	and	so	but	although	A	'So' thể hiện kết quả của việc đến muộn.
9339a53d-5810-5f72-91be-b7894f503670	365339d5-8348-5014-974d-fcb051a9bc25	Complete the sentence correctly: I will wait here ____ you come back.	if	when	because	but	A	'If' là sự chỉ định điều kiện cho việc đợi.
936ae364-00bb-5161-b5e4-47d75a2079b8	365339d5-8348-5014-974d-fcb051a9bc25	What’s the best conjunction to show contrast? He is rich, ____ he is unhappy.	because	although	and	or	B	'Although' chỉ ra rằng có sự tương phản giữa sự giàu có và cảm giác không hạnh phúc.
9bd6761a-8126-53ba-906c-e1837fe51c82	365339d5-8348-5014-974d-fcb051a9bc25	Fill in the blank: You can come with us, ____ you can stay here.	but	and	or	so	C	'Or' chỉ sự lựa chọn giữa hai hành động.
be8b8823-1fa6-5e41-be23-2316e3ef3548	365339d5-8348-5014-974d-fcb051a9bc25	Which conjunction shows purpose? He studied hard ____ he could pass the exam.	as	so that	when	though	C	'So that' thể hiện mục đích của việc học.
c22bd482-52ad-515a-a50d-1e3db9322c5c	365339d5-8348-5014-974d-fcb051a9bc25	Identify the conjunction to indicate a choice: Would you prefer tea ____ coffee?	and	or	but	so	B	'Or' thể hiện sự lựa chọn giữa trà và cà phê.
db625af9-6afa-5b32-8469-2bb7ae39ddfc	365339d5-8348-5014-974d-fcb051a9bc25	Choose the correct conjunction: She ate dinner, ____ she wasn’t hungry.	although	but	and	or	D	'Although' không phù hợp; 'but' thể hiện sự mâu thuẫn giữa việc ăn và cảm giác không đói.
f751977e-bce5-5b8c-9abd-ba4b384cbcd0	365339d5-8348-5014-974d-fcb051a9bc25	Which word can be used to indicate a reason in this sentence? She went home early ____ she was feeling sick.	because	although	if	when	B	'Although' không phù hợp vì nó chỉ sự tương phản; 'because' là chính xác trong trường hợp này.
\.


--
-- Data for Name: grammartopics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grammartopics (id, categoryid, title, titlevi, content, orderindex) FROM stdin;
d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	46	Prepositions of Time & Place	Giới từ chỉ thời gian, nơi chốn và chuyển động	<h2>Giới từ (Prepositions)</h2><h3>I. Định nghĩa (Definition)</h3><p>Giới từ là từ hoặc nhóm từ thường được dùng trước danh từ hoặc đại từ để chỉ sự liên hệ giữa danh từ hoặc đại từ này với các thành phần khác trong câu.</p><pre><code>Ex: I left your book on the table. (Tôi để cuốn sách của anh trên bàn.) </code></pre><p>Giới từ còn chỉ mối liên hệ giữa đại từ với động từ speak.</p><pre><code>Ex: He is talking of emigrating. (Ông ta đang nói về việc di cư.) </code></pre><h3>II. Các loại giới từ (Kinds of prepositions)</h3><h4>1. Giới từ chỉ nơi chốn (prepositions of place)</h4><ul><li><strong>AT:</strong> ở; tại <ul><li>Được dùng để chỉ vị trí tại một điểm. <pre><code>Ex: They were at Mike’s house last night. (Tối hôm qua họ đã ở nhà Mike.) </code></pre></li></ul></li><li><strong>IN:</strong> trong <ul><li>Dùng để chỉ vị trí bên trong một diện tích, hoặc trong không gian ba chiều. <pre><code>Ex: There are 400 seats in the theater. (Có 400 chỗ ngồi trong rạp chiếu bóng.) </code></pre></li></ul></li><li><strong>ON:</strong> trên; ở trên <ul><li>Dùng để chỉ vị trí trên bề mặt. <pre><code>Ex: I sat on the grass. (Tôi ngồi trên cỏ.) </code></pre></li></ul></li></ul><h4>2. Giới từ chỉ thời gian (prepositions of time)</h4><ul><li><strong>AT:</strong> vào lúc <pre><code>Ex: I will see you at noon. (Tôi sẽ gặp bạn vào buổi trưa.) </code></pre></li><li><strong>IN:</strong> trong <ul><li>Dùng để chỉ khoảng thời gian dài. <pre><code>Ex: Mozart was born in 1756. (Mozart sinh năm 1756.) </code></pre></li></ul></li><li><strong>ON:</strong> vào; vào ngày <pre><code>Ex: I will see you on Tuesday. (Tôi sẽ gặp bạn vào thứ Ba.) </code></pre></li></ul><h4>3. Giới từ chỉ chuyển động (Prepositions of movement)</h4><ul><li><strong>TO:</strong> đến <pre><code>Ex: She walks to school every day. (Cô ấy đi bộ đến trường mỗi ngày.) </code></pre></li><li><strong>FROM:</strong> từ <pre><code>Ex: We drove from London to Edinburgh. (Chúng tôi lái xe từ London đến Edinburgh.) </code></pre></li><li><strong>ACROSS:</strong> qua <pre><code>Ex: The explorers walked across the desert. (Đoàn thám hiểm đi qua sa mạc.) </code></pre></li></ul><h3>III. Lưu ý</h3><ul><li><strong>Phân biệt một số giới từ:</strong></li><ul><li>Between: ở giữa (hai người, vật hoặc nhóm).</li><li>Among: ở giữa (một đám đông hoặc một nhóm người).</li></ul></ul>	0
e088946a-b0cf-494c-9746-85e1420a95c1	39	Zero & First Conditional	Câu điều kiện loại 0 & 1	<h3>1. Cấu tạo câu điều kiện</h3><p>Câu điều kiện gồm mệnh đề <strong>if</strong> nêu điều kiện và mệnh đề chính nêu kết quả. Mệnh đề if có thể đứng trước hoặc sau; khi đứng trước, thường có dấu phẩy ngăn cách.</p><h3>2. Điều kiện loại 0: sự thật, quy luật, thói quen</h3><pre><code>If + present simple, present simple</code></pre><blockquote><p><strong>Ví dụ:</strong> If you <strong>heat</strong> ice, it <strong>turns</strong> to water. <em>(Nếu đun nóng nước đá, nó tan thành nước.)</em></p></blockquote><h3>3. Điều kiện loại 1: điều kiện có thật ở hiện tại hoặc tương lai</h3><pre><code>If + present simple, will + V nguyên thể</code></pre><p>Mệnh đề chính còn có thể dùng <strong>can, may, might, should, ought to, must</strong> hoặc câu mệnh lệnh tùy ý nghĩa.</p><blockquote><p><strong>Ví dụ:</strong> If it <strong>doesn't rain</strong>, we <strong>will have</strong> a picnic. <em>(Nếu trời không mưa, chúng ta sẽ đi dã ngoại.)</em></p><p>If you <strong>need</strong> a ticket, I <strong>can get</strong> you one. <em>(Nếu bạn cần vé, tôi có thể lấy cho bạn một vé.)</em></p></blockquote><h3>4. Lưu ý</h3><ul><li>Thông thường không dùng <strong>will</strong> trong mệnh đề if: <em>If we hurry, we'll catch the bus.</em></li><li><strong>should</strong> có thể dùng trong mệnh đề if khi điều kiện ít chắc chắn: <em>If anyone should call, take a message.</em></li><li><strong>unless</strong> = <em>if...not</em>: <em>Unless you study hard, you'll fail.</em></li><li>Mệnh đề if có thể dùng hiện tại tiếp diễn hoặc hiện tại hoàn thành khi ngữ cảnh yêu cầu.</li></ul>	0
90ad11e3-ee89-49c2-a421-0ef502b8744a	38	Past Simple	Thì quá khứ đơn	<h2>V. Thì quá khứ đơn (The Past Simple Tense)</h2><h3>1. Câu trúc (Form)</h3><ul><li><strong>a. Thể khẳng định (Affirmative form)</strong></li></ul><pre><code>Subject + I/You/He/She/It/We/They + verb (past tense)</code></pre><p><strong>Ví dụ:</strong> I met him yesterday. (Hôm qua tôi đã gặp anh ấy.)</p><ul><li><strong>b. Thể phủ định (Negative form)</strong></li></ul><pre><code>Subject + did not/didn't + verb (bare-inf.)</code></pre><p><strong>Ví dụ:</strong> He wasn't present at class yesterday. (Hôm qua anh ta đã không đi học.)</p><p>Đối với động từ thường, dùng trợ động từ did.</p><pre><code>Subject + did not/didn't + verb (bare-inf.)</code></pre><p><strong>Ví dụ:</strong> I didn't watch TV last night. (Tối qua tôi không xem tivi.)</p><ul><li><strong>c. Thể nghi vấn (Interrogative form)</strong></li></ul><pre><code>Did + subject + verb (bare-inf.)?</code></pre><p><strong>Ví dụ:</strong> Did you see my son, Tom? (Tom, bạn có nhìn thấy con trai tôi không?)</p><h3>2. Cách dùng (Use)</h3><ul><li><strong>a. Hành động đã bắt đầu và đã kết thúc tại một thời điểm cụ thể trong quá khứ.</strong></li><p><strong>Ví dụ:</strong> Tom went to Paris last summer. (Mùa hè trước, Tom đã đi Paris.)</p><p>Hai năm trước đây, tôi đã rời thành phố này.</p><li><strong>b. Hành động đã xảy ra suốt một khoảng thời gian trong quá khứ.</strong></li><p><strong>Ví dụ:</strong> He worked in that bank for four years. (Anh ta đã làm việc trong ngân hàng đó bốn năm.)</p><li><strong>c. Hành động được lặp đi lặp lại hay thường xuyên trong quá khứ.</strong></li><p><strong>Ví dụ:</strong> He always carried an umbrella. (Ông ta luôn mang theo dù.)</p><li><strong>d. Một loạt hành động xảy ra liên tiếp nhau trong quá khứ.</strong></li><p><strong>Ví dụ:</strong> When we saw the spaceship, we stopped the car. (Khi chúng tôi nhìn thấy tàu vũ trụ, chúng tôi ngừng xe lại.)</p></ul><h3>3. Lưu ý (Notes)</h3><ul><li>Cách chia động từ ở quá khứ đơn (past tense)</li><li>Đối với động từ quy tắc (regular verbs): thêm <em>-ed</em> sau động từ nguyên mẫu.</li><pre><code>finish → finished</code></pre><li>Đối với động từ bất quy tắc (irregular verbs): động từ sẽ có 2 cột 2 (V2 - past tense) trong bảng động từ bất quy tắc.</li><pre><code>see → saw; go → went</code></pre></ul>	4
898cd0be-8da5-413e-b201-5d622ac826de	39	Third Conditional	Câu điều kiện loại 3	<h3>1. Cách dùng</h3><p>Câu điều kiện loại 3 nói về một tình huống đã không xảy ra trong quá khứ và kết quả giả định trái với sự thật quá khứ. Cấu trúc thường dùng để nêu sự tiếc nuối hoặc đánh giá lại một việc đã qua.</p><h3>2. Công thức</h3><pre><code>If + S + had + V3, S + would have + V3</code></pre><p>Trong mệnh đề chính có thể dùng <strong>could have</strong> hoặc <strong>might have</strong> để diễn tả khả năng đã có thể xảy ra.</p><blockquote><p><strong>Ví dụ:</strong> If he <strong>had studied</strong> hard, he <strong>would have passed</strong> his exam. <em>(Nếu anh ấy học chăm thì đã thi đậu; thực tế anh ấy đã không học chăm và bị trượt.)</em></p><p>If I <strong>had had</strong> my phone, I <strong>could have contacted</strong> you. <em>(Nếu lúc đó có điện thoại, tôi đã có thể liên lạc với bạn.)</em></p></blockquote><h3>3. Lưu ý</h3><ul><li>Không dùng <strong>would have</strong> trong mệnh đề if thông thường.</li><li>Dạng rút gọn <strong>'d</strong> có thể là <em>had</em> trong mệnh đề if hoặc <em>would</em> trong mệnh đề chính: <em>If you'd asked me, I'd have told you.</em></li><li>Mệnh đề if có thể đứng sau mệnh đề chính mà không cần dấu phẩy.</li></ul><h3>4. Điều kiện hỗn hợp</h3><p>Khi điều kiện ở quá khứ nhưng kết quả còn ở hiện tại, có thể kết hợp loại 3 và loại 2:</p><pre><code>If + past perfect, would + V nguyên thể</code></pre><blockquote><p><strong>Ví dụ:</strong> If I <strong>had eaten</strong> breakfast, I <strong>wouldn't be</strong> hungry now. <em>(Nếu sáng nay tôi ăn sáng thì bây giờ đã không đói.)</em></p></blockquote>	2
f49c9967-880b-49d0-b9ca-7ebe37dd0971	45	Articles (A / An / The)	Mạo từ a, an, the và trường hợp không dùng mạo từ	<h2>Mạo từ (Articles)</h2><h3>I. Định nghĩa (Definition)</h3><p>Mạo từ (articles) là từ dùng trước danh từ để chỉ định rằng từ ấy đề cập đến một đối tượng cụ thể hay không xác định.</p><h3>II. Các loại mạo từ (Kinds of articles)</h3><p>Mạo từ trong tiếng Anh được phân thành hai loại: mạo từ bất định và mạo từ xác định.</p><h4>1. Mạo từ bất định (indefinite articles): A / AN</h4><ul><li><strong>A</strong> đứng trước danh từ bắt đầu bằng một phụ âm (consonant).</li><blockquote><p><strong>Ví dụ:</strong> a chair, a house, a university / 'junɪ'vɜːsəti.</p></blockquote><li><strong>AN</strong> đứng trước danh từ bắt đầu bằng một nguyên âm (vowel).</li><blockquote><p><strong>Ví dụ:</strong> an apple, an egg, an umbrella.</p></blockquote><li><strong>Lưu ý:</strong> Danh từ số ít (singular noun) có thể dùng với mạo từ bất định.</li></ul><h4>1.1. Các trường hợp dùng mạo từ a/an</h4><ul><li>Mạo từ a/an được dùng trước danh từ đếm được số ít để nói về người hoặc vật bất kỳ của một loại.</li><blockquote><p><strong>Ví dụ:</strong> An owl can see in the dark (Cú có thể nhìn rõ trong bóng tối).</p></blockquote><li>Được dùng sau hệ từ (linking verbs) hoặc để phân loại người hay vật.</li><blockquote><p><strong>Ví dụ:</strong> Mr Johnson is a sales manager (Ông Johnson là giám đốc kinh doanh).</p></blockquote></ul><h4>1.2. Các trường hợp không dùng mạo từ a/an</h4><ul><li>Trước danh từ số nhiều (plural noun) hoặc danh từ không đếm được (uncountable noun).</li><blockquote><p><strong>Ví dụ:</strong> Owls can see in the dark (Cú có thể nhìn trong bóng tối).</p></blockquote></ul><h4>2. Mạo từ xác định (definite article): THE</h4><p>Mạo tử xác định <strong>the</strong> được dùng cho tất cả các danh từ: danh từ đếm được số ít (singular countable noun), danh từ đếm được số nhiều (plural countable noun) và danh từ không đếm được (uncountable noun).</p><blockquote><p><strong>Ví dụ:</strong> the boy, the boys, the food.</p></blockquote><h4>2.1. Các trường hợp dùng mạo từ the</h4><ul><li>Được dùng trước danh từ chỉ những người hay vật đã xác định hoặc đã được đề cập trước đó.</li><blockquote><p><strong>Ví dụ:</strong> Did you lock the car? (Anh đã khóa xe rồi chứ?).</p></blockquote><li>Được dùng trước tính từ hoặc trạng từ trong so sánh nhất, trước first, second, third,…</li><blockquote><p><strong>Ví dụ:</strong> I’m the oldest in my family (Tôi là người lớn tuổi nhất trong gia đình).</p></blockquote></ul><h4>2.2. Các trường hợp không dùng mạo từ the</h4><ul><li>Trước các danh từ chỉ nơi chốn như: hospital, church, prison, school, college, university khi đề cập đến khái niệm tổng quát.</li><blockquote><p><strong>Ví dụ:</strong> The injured were taken to hospital (Những người bị thương được đưa tới bệnh viện).</p></blockquote></ul><h3>III. Lưu ý (Notes)</h3><p>Mạo từ the có thể kèm theo danh từ chỉ một nhóm, một loại, một phần trong xã hội, chẳng hạn như: the young, the old, the disabled,...</p><blockquote><p><strong>Ví dụ:</strong> The rich should provide accommodation for the homeless.</p></blockquote>	0
1390d58f-d902-4d8a-a6cc-e455e66c25e7	38	Present Continuous	Thì hiện tại tiếp diễn	<h2>Thì Hiện Tại Tiếp Diễn (Present Continuous)</h2><h3>I. Định Nghĩa</h3><p>Thì hiện tại tiếp diễn được sử dụng để diễn tả hành động đang xảy ra ở hiện tại hoặc một khoảng thời gian cụ thể.</p><h3>II. Cách Dùng</h3><ul><li><h4>a. Hành động thực sự diễn ra ngay lúc nói</h4><blockquote><p><strong>Ví dụ:</strong> I am studying English. (Tôi đang học tiếng Anh.)</p></blockquote></li><li><h4>b. Hành động không ngừng diễn ra nhưng không nhất thiết phải thực sự diễn ra ngay lúc nói</h4><blockquote><p><strong>Ví dụ:</strong> I am reading an interesting book at the moment. (Tôi đang đọc một cuốn sách thú vị.)</p></blockquote></li><li><h4>c. Hành động sẽ xảy ra trong tương lai gần</h4><blockquote><p><strong>Ví dụ:</strong> He is coming tomorrow. (Ngày mai anh ta sẽ đến.)</p></blockquote></li><li><h4>d. Hành động có tính chất tạm thời</h4><blockquote><p><strong>Ví dụ:</strong> I am working at a sports shop for six weeks. (Tôi làm việc tại một cửa hàng thể thao trong sáu tuần.)</p></blockquote></li><li><h4>e. Hành động thường xuyên lặp đi lặp lại gây sự bực mình hoặc khó chịu cho người nghe</h4><blockquote><p><strong>Ví dụ:</strong> She is always talking to me. (Cô ấy luôn nói chuyện với tôi.)</p></blockquote></li></ul><h3>III. Cấu Trúc</h3><table><thead><tr><th>Thì</th><th>Cấu trúc</th><th>Ví dụ</th></tr></thead><tbody><tr><td>Khẳng định (Affirmative form)</td><td><pre><code>He/She/It + am/is + verb-ing</code></pre><pre><code>We/You/They + are + verb-ing</code></pre></td><td><blockquote><p><strong>Ví dụ:</strong> She is eating. (Cô ấy đang ăn.)</p></blockquote></td></tr><tr><td>Phủ định (Negative form)</td><td><pre><code>Subject + am/is/are + not + verb-ing</code></pre></td><td><blockquote><p><strong>Ví dụ:</strong> They are not playing. (Họ không đang chơi.)</p></blockquote></td></tr><tr><td>Nghi vấn (Interrogative form)</td><td><pre><code>Am/Is/Are + subject + verb-ing?</code></pre></td><td><blockquote><p><strong>Ví dụ:</strong> Are you coming? (Bạn có đến không?)</p></blockquote></td></tr></tbody></table><h3>IV. Những Lưu Ý Khi Sử Dụng</h3><ul><li>Sử dụng các trạng từ chỉ thời gian như: now, at the moment, at present, to diễn tả sự việc đang diễn ra ngay hiện tại.</li><li>Thì hiện tại tiếp diễn không được dùng cho các động từ không thể hiện hành động (ví dụ: like, want, know).</li></ul>	1
9e91d53c-79f4-4d39-88b1-e371f22faf60	38	Present Perfect	Thì hiện tại hoàn thành	<h2>I. Thì hiện tại hoàn thành (Present Perfect Tense)</h2><h3>1. Cấu trúc (Form)</h3><ul><li><strong>a. Thì khẳng định (Affirmative form)</strong></li><pre><code>Subject + have/has + past participle</code></pre><p><strong>Ví dụ:</strong><em>I have broken my leg.</em> (Tôi đã gãy chân.)</p><li><strong>b. Thì phủ định (Negative form)</strong></li><pre><code>Subject + have/has + not + past participle</code></pre><p><strong>Ví dụ:</strong><em>John hasn’t finished his report yet.</em> (John chưa làm xong báo cáo của mình.)</p><li><strong>c. Thể nghi vấn (Interrogative form)</strong></li><pre><code>Have/Has + subject + past participle?</code></pre><p><strong>Ví dụ:</strong><em>Have you seen Jane recently?</em> (Gần đây bạn có gặp Jane không?)</p></ul><h3>2. Cách dùng (Use)</h3><ul><li><strong>a. Hành động vừa mới xảy ra</strong></li><pre><code>I have visited Hanoi.</code></pre><p><strong>Ví dụ:</strong><em>I have visited Hanoi.</em> (Tôi đã đi thăm Hà Nội.)</p><li><strong>b. Hành động xảy ra trong quá khứ nhưng có liên quan đến hiện tại</strong></li><pre><code>Subject + have/has + past participle</code></pre><p><strong>Ví dụ:</strong><em>I have lost my keys.</em> (Tôi đã mất chìa khóa của mình.)</p><li><strong>c. Hành động đã xảy ra nhiều lần trong quá khứ</strong></li><pre><code>Subject + have/has + past participle</code></pre><p><strong>Ví dụ:</strong><em>She has seen it eight times.</em> (Cô ấy đã xem phim đó tám lần.)</p><li><strong>d. Hành động đã xảy ra trong quá khứ nhưng kết quả của nó vẫn còn trong hiện tại</strong></li><pre><code>Subject + have/has + past participle</code></pre><p><strong>Ví dụ:</strong><em>Tom has had a bad car crash.</em> (Tom đã bị tai nạn ô tô nghiêm trọng.)</p><li><strong>e. Hành động bắt đầu trong quá khứ, kéo dài đến hiện tại và có khả năng tiếp tục ở tương lai</strong></li><pre><code>Subject + have/has + past participle</code></pre><p><strong>Ví dụ:</strong><em>Mary has lived in the town for ten years.</em> (Mary đã sống ở thị trấn này được mười năm rồi.)</p><li><strong>f. Hành động xảy ra trong một khoảng thời gian đã chấm dứt trong quá khứ, ta phải dùng thì quá khứ đơn</strong></li><pre><code>Subject + past simple</code></pre><p><strong>Ví dụ:</strong><em>She lived in the town for ten years.</em> (Cô ấy đã sống ở thành phố này trong mười năm.)</p></ul><h3>3. Các từ hoặc cụm từ thường được dùng với thì hiện tại hoàn thành</h3><table><thead><tr><th>Từ/Cụm từ</th><th>Ý nghĩa</th></tr></thead><tbody><tr><td>just</td><td>vừa mới</td></tr><tr><td>recently</td><td>gần đây</td></tr><tr><td>lately</td><td>vừa mới</td></tr><tr><td>already</td><td>đã</td></tr><tr><td>before</td><td>trước đây</td></tr><tr><td>ever</td><td> đã từng</td></tr><tr><td>never</td><td>chưa bao giờ</td></tr><tr><td>for</td><td>trong khoảng</td></tr><tr><td>since</td><td>kể từ</td></tr><tr><td>yet</td><td>chưa</td></tr></tbody></table>	2
22f8f287-7934-484c-86cc-25caa5320092	38	Future Simple	Thì tương lai đơn	<h2>IX. Thì tương lai đơn (The Future Simple Tense)</h2><h3>1. Cấu trúc</h3><ul><li><h4>a. Thể khẳng định (Affirmative form)</h4><pre><code>I/ We + will/ shall + verb (bare-inf)</code></pre><p><strong>Ví dụ:</strong> I’ll be on holiday in August. (Tôi sẽ đi nghỉ vào tháng Tám.)</p></li><li><h4>b. Thể phủ định (Negative form)</h4><pre><code>Subject + will/ shall + not + verb (bare-inf)</code></pre><p><strong>Ví dụ:</strong> We won’t shan’t have time for a meal. (Chúng ta sẽ không có thời gian để ăn.)</p></li><li><h4>c. Thể nghi vấn (Interrogative form)</h4><pre><code>Will/ Shall + subject + verb (bare-inf)?</code></pre><p><strong>Ví dụ:</strong> Will you be at home this evening? (Chiều nay anh có ở nhà không?)</p></li></ul><h3>2. Cách dùng</h3><ul><li><h4>a. Diễn tả một hành động sẽ xảy ra trong tương lai, hoặc hành động sẽ xảy ra trong một khoảng thời gian dài ở tương lai.</h4><p><strong>Ví dụ:</strong> The international conference will open next week. (Hội nghị quốc tế sẽ khai mạc vào tuần tới.)</p></li><li><h4>b. Diễn đạt ý kiến, sự chắc chắn, sự dự đoán của người nói về một điều gì đó trong tương lai.</h4><p><strong>Ví dụ:</strong> I’m sure he will come back soon. (Tôi chắc là lát nữa anh ấy sẽ về.)</p></li><li><h4>c. Đưa ra một lời hứa, lời đề nghị.</h4><p><strong>Ví dụ:</strong> I’ll call you tomorrow. (Ngày mai tôi sẽ gọi điện cho anh.)</p></li><li><h4>d. Đưa ra lời yêu cầu, lời đề nghị, và lời mời.</h4><p><strong>Ví dụ:</strong> Will you open the door? (Anh có thể mở cửa giúp tôi không?)</p></li></ul><h3>3. Các trạng từ thường được dùng</h3><ul><li>someday (một ngày nào đó)</li><li>tomorrow (ngày mai)</li><li>next week/ next month (tuần tới/tháng tới)</li><li>soon (chẳng bao lâu nữa)</li></ul><h4>Lưu ý:</h4><p>Người Anh dùng I will / shall và we will / we shall có nghĩa như nhau để diễn đạt về tương lai, nhưng shall ít được dùng hơn trong lời văn hay lời nói hiện đại.</p>	8
ae1a29d5-7711-46ff-bfed-f66c51979174	42	Modal Verbs	Động từ khuyết thiếu	<h2>1. Định nghĩa động từ khuyết thiếu (Modal Verbs)</h2><p>Động từ khuyết thiếu là các động từ không có hình thức chia thì như các động từ thông thường. Chúng được sử dụng để diễn đạt khả năng, sự cho phép, nghĩa vụ, hoặc dự đoán.</p><h3>1.1. Các đặc điểm chính</h3><ul><li>Không thay đổi theo chủ ngữ.</li><li>Đi sau modal verb là động từ nguyên mẫu không có "to".</li><li>Không có hình thức quá khứ hoàn thành hoặc phân từ quá khứ.</li></ul><h2>2. Phân loại động từ khuyết thiếu</h2><h3>2.1. Động từ khuyết thiếu phổ biến</h3><table><thead><tr><th>Modal Verb</th><th>Cách dùng</th><th>Ví dụ</th></tr></thead><tbody><tr><td>Can</td><td>Diễn tả khả năng, sự cho phép.</td><td><blockquote><p><strong>Ví dụ:</strong> She can swim.</p></blockquote></td></tr><tr><td>Could</td><td>Diễn tả khả năng trong quá khứ.</td><td><blockquote><p><strong>Ví dụ:</strong> I could read when I was five.</p></blockquote></td></tr><tr><td>May</td><td>Diễn tả khả năng hoặc xin phép.</td><td><blockquote><p><strong>Ví dụ:</strong> You may leave now.</p></blockquote></td></tr><tr><td>Might</td><td>Diễn tả khả năng có thể xảy ra trong tương lai.</td><td><blockquote><p><strong>Ví dụ:</strong> It might rain later.</p></blockquote></td></tr><tr><td>Must</td><td>Diễn tả sự cần thiết hoặc nghĩa vụ.</td><td><blockquote><p><strong>Ví dụ:</strong> You must stop smoking.</p></blockquote></td></tr><tr><td>Should</td><td>Đưa ra lời khuyên.</td><td><blockquote><p><strong>Ví dụ:</strong> You should see a doctor.</p></blockquote></td></tr></tbody></table><h2>3. Cách sử dụng động từ khuyết thiếu</h2><h3>3.1. Can và Could</h3><ul><li><strong>Can:</strong> Dùng để nói về khả năng hiện tại.</li><li><strong>Could:</strong> Dùng để thể hiện khả năng trong quá khứ.</li></ul><h3>3.2. May và Might</h3><ul><li><strong>May:</strong> Được sử dụng để diễn tả khả năng có thể xảy ra hoặc để xin phép.</li><li><strong>Might:</strong> Thường sử dụng để diễn tả khả năng không chắc chắn.</li></ul><h3>3.3. Must và Should</h3><ul><li><strong>Must:</strong> Dùng để diễn tả sự cần thiết mạnh mẽ.</li><li><strong>Should:</strong> Dùng để đưa ra lời khuyên hoặc để chỉ ra rằng điều gì đó là đúng.</li></ul><h2>4. Công thức cơ bản</h2><p>Các cấu trúc cơ bản để sử dụng động từ khuyết thiếu như sau:</p><pre><code> Modal Verb + bare infinitive (no "to") Ví dụ: Can + swim Should + call </code></pre><h2>5. Những lưu ý đặc biệt</h2><ul><li>Không sử dụng "to" sau động từ khuyết thiếu.</li><li>Không chia động từ khuyết thiếu theo số nhiều hoặc thì.</li><li>Can, could, may, might, must thường không có hình thức quá khứ.</li></ul>	0
165b74f8-2224-4556-bf9a-8f3aadea49fd	43	Comparatives & Superlatives	So sánh tính từ và trạng từ	<h2>So sánh tính từ và trạng từ (Comparatives &amp; Superlatives)</h2><h3>I. So sánh bằng (Positive form)</h3><p>Hình thức so sánh bằng được thành lập bằng cách thêm <i>as</i> vào trước và sau tính từ (adjective) hoặc trạng từ (adverb).</p><pre><code>S + V + as + adj/ adv + as + noun/pronoun/clause</code></pre><p><strong>Ví dụ:</strong> My hands were as cold as ice. (Tay tôi lạnh như đá.)</p><p>Jane sings as well as her sister. (Jane hát hay như chị cô ấy.)</p><p>Is the film as interesting as you expected? (Phim có hay như bạn mong đợi không?)</p><p>Công thức phủ định: <i>not as/ so + adj/ adv + as</i></p><p><strong>Ví dụ:</strong> This flat isn't as/ so big as our old one. (Căn hộ này không lớn bằng căn hộ cũ của chúng tôi.)</p><br><p>So sánh nhau hoặc khác nhau cũng có thể được diễn đạt bằng cấu trúc <i>the same as</i>.</p><pre><code>S + V + the same + noun + as + noun/pronoun</code></pre><p><strong>Ví dụ:</strong> My house is as high as his. = My house is the same height as his. (Nhà tôi cao bằng nhà anh ấy.)</p><p>Tom is as old as Mary. (Tom cũng tuổi với Mary.)</p><p>Anne's salary is as much as mine. (Lương của Anne bằng lương của tôi.)</p><h4>Lưu ý:</h4><ul><li>Chúng ta dùng <i>the same as</i> chứ không dùng <i>the same like</i>.</li><li><strong>Ví dụ:</strong> What would you like to drink? I'll have the same as you. (Anh muốn uống gì? – Tôi cũng giống như anh.)</li><li>Dùng <i>less than</i> và <i>not as/ so ... as</i>...</li></ul><h3>II. So sánh hơn (Comparative form)</h3><p>Hình thức so sánh hơn của tính từ và trạng từ được thành lập bằng cách:</p><ul><li><i>Thêm -er</i> vào sau tính từ hoặc trạng từ có một âm tiết (short adjective/adverb).</li><pre><code>short adj/ adv + er</code></pre><p><strong>Ví dụ:</strong> The giraffe is taller than the man. (Hươu cao cổ cao hơn con người.)</p><li><i>Thêm more</i> vào trước tính từ hoặc trạng từ có hai âm tiết trở lên (long adjective/adverb).</li><pre><code>more + long adj/ adv</code></pre><p><strong>Ví dụ:</strong> The exam was more difficult than we expected. (Bài kiểm tra khó hơn chúng tôi nghĩ.)</p></ul><p>So sánh hơn có thể được nhấn mạnh bằng cách thêm <i>much</i> hoặc <i>far</i>.</p><p><strong>Ví dụ:</strong> Harry's watch is much/ far more expensive than mine. (Đồng hồ của Harry đắt hơn nhiều so với đồng hồ của tôi.)</p><h3>III. So sánh nhất (Superlative form)</h3><p>Hình thức so sánh nhất của tính từ hoặc trạng từ được thành lập bằng cách:</p><ul><li><i>Thêm -est</i> vào sau tính từ hoặc trạng từ có một âm tiết.</li><pre><code>short adj/ adv + est</code></pre><p><strong>Ví dụ:</strong> I'm the happiest man in the world. (Tôi là người hạnh phúc nhất trên đời.)</p><li><i>Thêm most</i> vào trước tính từ hoặc trạng từ dài (long adjective/adverb).</li><pre><code>most + long adj/ adv</code></pre><p><strong>Ví dụ:</strong> Love is the most important thing. (Tình yêu là điều quan trọng nhất.)</p></ul><p>So sánh nhất có thể được nghĩa bằng <i>much</i> hoặc <i>by far</i>.</p><p><strong>Ví dụ:</strong> Amy is the smartest by far. (Cô ấy thông minh nhất rất nhiều.)</p><h3>IV. Cách thêm đuôi -er và -est (Spelling rules for the -er and -est ending)</h3><p>Tính từ không có trọng âm tận cùng bằng: thêm -er và -est.</p><table><thead><tr><th>Tính từ</th><th>So sánh hơn</th><th>So sánh nhất</th></tr></thead><tbody><tr><td>large (rộng)</td><td>larger</td><td>largest</td></tr><tr><td>happy (hạnh phúc)</td><td>happier</td><td>happiest</td></tr></tbody></table><h3>V. Hình thức so sánh đặc biệt (Special comparison)</h3><h4>1. So sánh kép (Double comparatives)</h4><p>Dạng so sánh đồng tiến với <i>the ... the</i> được dùng để diễn đạt sự cùng thay đổi (tăng thêm hoặc giảm bớt về số lượng hoặc mức độ) của sự việc.</p><pre><code>The + comparative + S + V + the + comparative</code></pre><p><strong>Ví dụ:</strong> The older I get, the happier I am. (Càng lớn tuổi tôi càng thấy hạnh phúc.)</p>	0
5153ff52-b78c-4eb3-8356-bfc30dfb6f14	38	Present Simple	Thì hiện tại đơn	<h2>Thì hiện tại đơn (The Present Simple Tense)</h2><h3>I. Cấu trúc (Form)</h3><h4>1. Thể khẳng định (Affirmative form)</h4><p>Động từ chia ở hiện tại (V - bare-infinitive)</p><ul><li>Ngôi thứ nhất số ít và ngôi thứ hai: <strong>I/ We/ You/ They</strong> + <strong>verb (bare-inf.)</strong></li><li>Ngôi thứ ba số ít: <strong>He/ She/ It</strong> + <strong>verb - s/ es</strong> (thêm -es sau các động từ tận cùng là o, s, x, z, ch, sh).</li></ul><pre><code>I/ We/ You/ They + verb (bare-inf.) He/ She/ It + verb - s/ es</code></pre><blockquote><p><strong>Ví dụ:</strong> I play tennis every Wednesday. (Tôi chơi tennis mỗi thứ Tư.)</p><p>Water consists of hydrogen and oxygen. (Nước gồm hidro và oxy.)</p></blockquote><h4>2. Thể phủ định (Negative form)</h4><ul><li>Đối với động từ to be (am/ is/ are), thêm not sau be.</li><blockquote><p><strong>Ví dụ:</strong> He is not/ isn’t a student. (Anh ta không phải là học sinh.)</p></blockquote><li>Đối với động từ thường, dùng trợ động từ do/ does.</li><pre><code>I/ You/ We/ They + do not (don't) + verb (bare-inf.) He/ She/ It + does not (doesn't) + verb (bare-inf.)</code></pre><blockquote><p><strong>Ví dụ:</strong> We don’t live far away. (Chúng tôi không xa đây lắm.)</p></blockquote></ul><h4>3. Thể nghi vấn (Interrogative form)</h4><ul><li>Đối với động từ to be, đẩy be ra đầu câu.</li><pre><code>Be + I/ you/ we/ they + ...?</code></pre><blockquote><p><strong>Ví dụ:</strong> Are you a student? (Bạn có phải là học sinh không?)</p></blockquote><li>Đối với động từ thường, dùng Do/ Does ở đầu câu.</li><pre><code>Do + I/ you/ we/ they + verb (bare-inf.)? Does + he/ she/ it + verb (bare-inf.)?</code></pre><blockquote><p><strong>Ví dụ:</strong> Do you live here? (Anh sống ở đây à?)</p></blockquote></ul><h3>II. Lưu ý (Notes)</h3><ul><li>Động từ thì hiện tại đơn ở ngôi thứ nhất số ít được thêm cách thì và động từ nguyên mẫu: work → works, sit → sits.</li><li>Thêm -es sau các động từ tận cùng với o, s, x, z, ch, sh như: go → goes, watch → watches.</li><li>Chú ý động từ có dạng phụ âm y thì bỏ y rồi thêm -ies: study → studies, stay → stays, enjoying → enjoys.</li><li>Không thêm -es vào động từ trong câu phủ định (negatives) và câu hỏi (questions).</li></ul>	0
72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	39	Second Conditional	Câu điều kiện loại 2	<h2>Câu điều kiện loại 2 (Second Conditional)</h2><h3>1. Định nghĩa</h3><p>Câu điều kiện loại 2 được sử dụng để diễn tả những tình huống không có thật trong hiện tại hoặc những điều không thể xảy ra. Nó thường liên quan đến khả năng thấp hoặc sự tưởng tượng trong tương lai.</p><h3>2. Cấu trúc</h3><p>Câu điều kiện loại 2 có dạng:</p><pre><code>IF-CLAUSE: Past simple MAIN CLAUSE: would + infinitive</code></pre><h3>3. Cách dùng</h3><ul><li>Diễn tả một tình huống không có thật ở hiện tại.</li><li>Đưa ra gợi ý hoặc lời khuyên tưởng tượng.</li></ul><h4>3.1. Ví dụ cơ bản</h4><blockquote><p><strong>Ví dụ:</strong> If I knew her name, I would tell you. (Nếu tôi biết tên cô ấy, tôi sẽ nói cho bạn biết.)</p></blockquote><h4>3.2. Sử dụng "could" và "might"</h4><ul><li>Trong câu điều kiện loại 2, có thể dùng "could" hoặc "might" để diễn tả khả năng.</li></ul><blockquote><p><strong>Ví dụ:</strong> If she had a camera, she could take some photos. (Nếu cô ấy có một chiếc máy ảnh, cô ấy có thể chụp một vài bức ảnh.)</p></blockquote><h4>3.3. Sử dụng "were" cho tất cả các đối tượng</h4><p>Trong câu điều kiện loại 2, "were" thường được sử dụng thay vì "was" cho tất cả các chủ ngữ.</p><blockquote><p><strong>Ví dụ:</strong> If Nick were rich, he would have a yacht. (Nếu Nick giàu có, anh ấy sẽ có một chiếc du thuyền.)</p></blockquote><h3>4. Lưu ý</h3><ul><li>Khi sử dụng câu điều kiện loại 2, không sử dụng "would" trong mệnh đề điều kiện (if-clause).</li></ul><blockquote><p><strong>Ví dụ:</strong> If I were you, I would accept their invitation. (Nếu tôi là bạn, tôi sẽ chấp nhận lời mời của họ.)</p></blockquote><h3>5. Nét phân biệt với các loại câu điều kiện khác</h3><table><thead><tr><th>Loại câu điều kiện</th><th>Cấu trúc If-clause</th><th>Cấu trúc Main clause</th><th>Diễn giải</th></tr></thead><tbody><tr><td>Loại 0</td><td>Present simple</td><td>Present simple</td><td>Diễn tả sự thật hiển nhiên, quy luật tự nhiên.</td></tr><tr><td>Loại 1</td><td>Present simple</td><td>Will + infinitive</td><td>Diễn tả khả năng xảy ra trong tương lai.</td></tr><tr><td>Loại 2</td><td>Past simple</td><td>would + infinitive</td><td>Diễn tả tình huống không có thật ở hiện tại.</td></tr><tr><td>Loại 3</td><td>Past perfect</td><td>would have + past participle</td><td>Diễn tả tình huống không xảy ra trong quá khứ.</td></tr></tbody></table>	1
8242916c-9535-4e55-893c-7d1338de5ea1	41	Reported Speech	Câu tường thuật (câu gián tiếp)	<h3>1. Lời nói trực tiếp và gián tiếp</h3><p>Lời nói gián tiếp thuật lại nội dung lời nói mà không giữ nguyên dấu ngoặc kép. Khi động từ tường thuật ở quá khứ, thì của động từ thường lùi về một bậc nếu nội dung không còn được xem là hiện tại.</p><h3>2. Bảng lùi thì cơ bản</h3><table><thead><tr><th>Trực tiếp</th><th>Gián tiếp</th></tr></thead><tbody><tr><td>present simple</td><td>past simple</td></tr><tr><td>present continuous</td><td>past continuous</td></tr><tr><td>present perfect / past simple</td><td>past perfect</td></tr><tr><td>will</td><td>would</td></tr><tr><td>can</td><td>could</td></tr><tr><td>may</td><td>might</td></tr><tr><td>must</td><td>had to (khi chỉ sự bắt buộc)</td></tr></tbody></table><h3>3. Câu trần thuật</h3><pre><code>say (that) + mệnh đề tell + tân ngữ + (that) + mệnh đề</code></pre><blockquote><p><strong>Ví dụ:</strong> “I am tired.” → He said (that) he <strong>was</strong> tired.</p></blockquote><h3>4. Câu hỏi</h3><pre><code>Yes/No: ask + if/whether + S + V Wh-question: ask + từ hỏi + S + V</code></pre><p>Câu hỏi gián tiếp dùng trật tự câu trần thuật, không đảo trợ động từ và không dùng dấu hỏi.</p><blockquote><p><strong>Ví dụ:</strong> “Where do you live?” → She asked me where I <strong>lived</strong>.</p></blockquote><h3>5. Mệnh lệnh, yêu cầu, lời khuyên</h3><pre><code>tell/ask/order/advise + tân ngữ + (not) to + V</code></pre><blockquote><p><strong>Ví dụ:</strong> “Don't touch it.” → He told me <strong>not to touch</strong> it.</p></blockquote><h3>6. Thay đổi theo ngữ cảnh</h3><p>Đại từ, tính từ sở hữu, nơi chốn và thời gian phải đổi theo người nói và thời điểm thuật lại: <em>now → then, today → that day, tomorrow → the next day, yesterday → the day before, here → there, this → that, these → those, ago → before</em>.</p><p>Không nhất thiết lùi thì khi động từ tường thuật ở hiện tại, hoặc khi lời nói diễn tả sự thật vẫn còn đúng.</p>	0
a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	40	Passive Voice	Câu bị động toàn diện	<h3>1. Câu chủ động và câu bị động</h3><p>Dùng câu bị động khi muốn nhấn mạnh người/vật chịu tác động, hoặc khi tác nhân không biết, không quan trọng hay đã rõ. Chỉ ngoại động từ mới chuyển sang bị động được.</p><h3>2. Công thức chung</h3><pre><code>S mới + be (chia theo thì) + V3/ed + (by + tác nhân)</code></pre><p>Tân ngữ của câu chủ động trở thành chủ ngữ câu bị động. Động từ <strong>be</strong> giữ đúng thì của câu chủ động; động từ chính chuyển sang V3.</p><table><thead><tr><th>Thì/dạng</th><th>Cấu trúc bị động</th></tr></thead><tbody><tr><td>Hiện tại đơn</td><td>am/is/are + V3</td></tr><tr><td>Hiện tại tiếp diễn</td><td>am/is/are being + V3</td></tr><tr><td>Hiện tại hoàn thành</td><td>have/has been + V3</td></tr><tr><td>Quá khứ đơn</td><td>was/were + V3</td></tr><tr><td>Quá khứ tiếp diễn</td><td>was/were being + V3</td></tr><tr><td>Quá khứ hoàn thành</td><td>had been + V3</td></tr><tr><td>Tương lai/modal</td><td>will/can/must... + be + V3</td></tr></tbody></table><blockquote><p><strong>Ví dụ:</strong> They built this bridge in 1990. → This bridge <strong>was built</strong> in 1990.</p><p>Someone is repairing the road. → The road <strong>is being repaired</strong>.</p></blockquote><h3>3. By và giới từ chỉ công cụ</h3><p>Dùng <strong>by</strong> cho tác nhân thực hiện hành động khi thông tin này cần thiết. Dùng <strong>with</strong> cho dụng cụ/chất liệu: <em>The window was broken with a stone.</em></p><h3>4. Cấu trúc bị động đặc biệt</h3><ul><li>Hai tân ngữ: <em>She was given a prize.</em> / <em>A prize was given to her.</em></li><li>Động từ tường thuật: <em>It is said that he is rich.</em> / <em>He is said to be rich.</em></li><li><strong>have/get + object + V3</strong>: nhờ/thuê ai làm hoặc gặp một việc tác động lên mình: <em>I had my car repaired.</em></li><li>Với modal: <em>The work must be finished today.</em></li></ul><h3>5. Lưu ý</h3><p>Không dùng <em>by + tác nhân</em> nếu tác nhân là các từ chung chung như <em>people, someone, they</em> và không bổ sung thông tin cần thiết.</p>	0
f826100c-a5d5-4963-8f8e-8023cb2024f8	44	Relative Clauses	Mệnh đề quan hệ	<h2>Mệnh đề quan hệ (Relative Clauses)</h2><p>Mệnh đề quan hệ (relative clauses) được sử dụng để bổ nghĩa cho danh từ đứng trước. Mệnh đề quan hệ đứng ngay sau danh từ mà nó bổ nghĩa và được bắt đầu bằng các đại từ quan hệ (relative pronouns) như <strong>who</strong>, <strong>whom</strong>, <strong>whose</strong>, <strong>which</strong>, <strong>that</strong> hoặc các trạng từ quan hệ (relative adverbs) như <strong>when</strong>, <strong>where</strong>, <strong>why</strong>.</p><h3>I. Các đại từ quan hệ và trạng từ quan hệ trong mệnh đề quan hệ</h3><h4>1. Đại từ quan hệ (Relative pronouns)</h4><ul><li><strong>a. Who:</strong> Dùng làm chủ ngữ (subject) hoặc tân ngữ (object) thay cho danh từ chỉ người. <blockquote><p><strong>Ví dụ:</strong> The man who is standing over there is Mr. Pike. (Người đứng ở kia là ông Pike.)</p></blockquote></li><li><strong>b. Whom:</strong> Thường được dùng làm tân ngữ thay cho who. <blockquote><p><strong>Ví dụ:</strong> The boy whom we are looking for is Tom. (Cậu bé mà chúng tôi đang tìm là Tom.)</p></blockquote></li><li><strong>c. Which:</strong> Dùng cho danh từ chỉ vật. <blockquote><p><strong>Ví dụ:</strong> This is the book which I like best. (Đây là cuốn sách tôi thích nhất.)</p></blockquote></li><li><strong>d. That:</strong> Dùng thay cho cả danh từ chỉ người và vật. <blockquote><p><strong>Ví dụ:</strong> The architect who/that designed this building is very famous. (Kiến trúc sư thiết kế tòa nhà này rất nổi tiếng.)</p></blockquote></li><li><strong>e. Whose:</strong> Dùng để chỉ sở hữu. <blockquote><p><strong>Ví dụ:</strong> The boy whose bicycle you borrowed yesterday is Tom. (Cậu bé mà bạn mượn xe đạp hôm qua tên là Tom.)</p></blockquote></li></ul><h4>2. Trạng từ quan hệ (Relative adverbs)</h4><ul><li><strong>a. Where:</strong> Dùng để chỉ địa điểm. <blockquote><p><strong>Ví dụ:</strong> This is the place where the accident happened. (Đây là nơi tai nạn đã xảy ra.)</p></blockquote></li><li><strong>b. When:</strong> Dùng để chỉ thời gian. <blockquote><p><strong>Ví dụ:</strong> I’ll never forget the day when I met her. (Tôi sẽ không bao giờ quên ngày mà tôi gặp cô ấy.)</p></blockquote></li><li><strong>c. Why:</strong> Dùng để chỉ lý do. <blockquote><p><strong>Ví dụ:</strong> Please tell me the reason why you are sad. (Hãy cho tôi biết lý do tại sao bạn buồn.)</p></blockquote></li></ul><h3>II. Giới từ trong mệnh đề quan hệ (Prepositions in relative clauses)</h3><ul><li><strong>1.</strong> Giới từ đứng trước các đại từ quan hệ whom và which. <blockquote><p><strong>Ví dụ:</strong> The man to whom my mother is talking is my form teacher. (Người đàn ông mà mẹ tôi đang nói chuyện là giáo viên chủ nhiệm của tôi.)</p></blockquote></li><li><strong>2.</strong> Giới từ theo sau động từ trong mệnh đề quan hệ. <blockquote><p><strong>Ví dụ:</strong> The book which I spoke about is very interesting. (Cuốn sách mà tôi đã nói về rất thú vị.)</p></blockquote></li></ul><h3>III. Các loại mệnh đề quan hệ (Kinds of relative clauses)</h3><ul><li><strong>1. Mệnh đề quan hệ xác định (Defining relative clauses):</strong> Dùng để xác định danh từ đứng trước nó, không có nghĩa câu bị thiếu. <blockquote><p><strong>Ví dụ:</strong> The man who robbed you has been arrested. (Người đàn ông đã lấy đồ của bạn đã bị bắt.)</p></blockquote></li><li><strong>2. Mệnh đề quan hệ không xác định (Non-defining relative clauses):</strong> Cung cấp thêm thông tin về một người, vật hoặc sự vật, không cần thiết phải có trong câu. <blockquote><p><strong>Ví dụ:</strong> My brother, who lives in the next flat, looks very lonely. (Anh trai tôi, người sống trong căn hộ kế bên, trông rất cô đơn.)</p></blockquote></li></ul><h3>IV. Dạng rút gọn của mệnh đề quan hệ (Reduced forms of relative clauses)</h3><p>Mệnh đề quan hệ có thể được rút gọn bằng cách dùng cụm phần từ (participle phrases), cụm danh từ (noun phrases) hoặc động từ nguyên mẫu (infinitive phrases).</p><ul><li><strong>1. Cụm phần từ (Participle phrases):</strong><blockquote><p><strong>Ví dụ:</strong> That man, sitting next to Mandy, is my uncle. (Người đàn ông ngồi cạnh Mandy là chú của tôi.)</p></blockquote></li><li><strong>2. Cụm danh từ (Noun phrases):</strong><blockquote><p><strong>Ví dụ:</strong> George Washington, who was the first president of the United States, was a general in the army. (George Washington, tổng thống đầu tiên của Hoa Kỳ, từng là một vị tướng trong quân đội.)</p></blockquote></li><li><strong>3. Cụm động từ nguyên mẫu (Infinitive phrases):</strong><blockquote><p><strong>Ví dụ:</strong> The captain was the last man to leave the ship. (Thuyền trưởng là người cuối cùng rời tàu.)</p></blockquote></li></ul>	0
4f518c44-9b4d-42a4-bade-5b9350334d0f	47	Gerunds & Infinitives	Danh động từ và động từ nguyên mẫu	<h2>Danh động từ và động từ nguyên mẫu (Gerunds &amp; Infinitives)</h2><h3>1. Định nghĩa</h3><p>Danh động từ (gerund) là hình thức của động từ kết thúc bằng <em>-ing</em> và được sử dụng như một danh từ. Động từ nguyên mẫu (infinitive) có dạng <strong>to + động từ</strong> và thường được dùng để chỉ hành động hoặc trạng thái.</p><h3>2. Phân loại</h3><ul><li><strong>Danh động từ</strong>: <ul><li>Chủ ngữ của câu: <pre><code>Swimming is fun.</code></pre></li><li>Bổ ngữ cho động từ: <pre><code>I enjoy reading.</code></pre></li><li>Tân ngữ của động từ: <pre><code>She likes dancing.</code></pre></li></ul></li><li><strong>Động từ nguyên mẫu</strong>: <ul><li>Bổ ngữ cho chủ ngữ: <pre><code>His aim is to win.</code></pre></li><li>Tân ngữ của động từ: <pre><code>He wants to eat.</code></pre></li></ul></li></ul><h3>3. Cách dùng</h3><h4>3.1. Cách dùng Danh động từ</h4><ul><li>Sử dụng như một danh từ trong câu: <pre><code>Reading helps you learn.</code></pre></li><li>Dùng sau các động từ như: enjoy, avoid, prefer: <blockquote><strong>Ví dụ:</strong> She enjoys swimming. </blockquote></li><li>Dùng sau giới từ: <blockquote><strong>Ví dụ:</strong> I am interested in learning. </blockquote></li></ul><h4>3.2. Cách dùng Động từ nguyên mẫu</h4><ul><li>Sử dụng để chỉ hành động trong tương lai: <blockquote><strong>Ví dụ:</strong> I want to learn French. </blockquote></li><li>Dùng sau động từ như: want, need, hope: <blockquote><strong>Ví dụ:</strong> They hope to win the game. </blockquote></li><li>Dùng trong các câu chỉ mục đích: <blockquote><strong>Ví dụ:</strong> She went to the store to buy groceries. </blockquote></li></ul><h3>4. Lưu ý đặc biệt</h3><ul><li>Các động từ có thể theo sau là danh động từ hoặc động từ nguyên mẫu: <ul><li>Like, love, hate: <pre><code>She loves swimming.</code></pre> hoặc <pre><code>She loves to swim.</code></pre></li></ul></li><li>Phân biệt giữa remember và forget: <ul><li>Remember + to + V: chỉ hành động sẽ thực hiện trong tương lai.</li><li>Forget + V-ing: chỉ hành động đã xảy ra mà không nhớ.</li></ul></li></ul><h3>5. Công thức</h3><h4>5.1. Công thức đứng một mình</h4><table><thead><tr><th>Danh động từ</th><th>Động từ nguyên mẫu</th></tr></thead><tbody><tr><td>enjoy + V-ing</td><td>want + to V</td></tr><tr><td>avoid + V-ing</td><td>need + to V</td></tr></tbody></table><h4>5.2. Công thức kết hợp với giới từ</h4><pre><code>verb + preposition + V-ing</code></pre><h3>6. Một số động từ cụ thể</h3><ul><li><strong>Advise:</strong> advise + object + to-infinitive (khuyên ai làm gì).</li><li><strong>Allow:</strong> allow + object + to-infinitive (cho phép ai làm gì).</li><li><strong>Regret:</strong> regret + V-ing (hối tiếc về việc đã làm).</li></ul><h3>7. Danh động từ trong cách diễn đạt khác</h3><p>Danh động từ có thể xuất hiện sau một số giới từ hoặc các cụm từ chỉ trạng thái khác.</p><blockquote><strong>Ví dụ:</strong> I’m tired of waiting. </blockquote>	0
fbbe5a1b-05da-4dfc-adf6-54d1234f026e	48	Question Tags	Câu hỏi đuôi: quy tắc và trường hợp đặc biệt	<h3>1. Chức năng và hình thức</h3><p>Câu hỏi đuôi là câu hỏi ngắn thêm vào cuối câu trần thuật để kiểm tra thông tin hoặc tìm sự đồng ý.</p><pre><code>Câu khẳng định + đuôi phủ định Câu phủ định + đuôi khẳng định Đuôi = trợ động từ (+ not) + đại từ</code></pre><blockquote><p><strong>Ví dụ:</strong> The children can swim, <strong>can't they</strong>?</p><p>David hasn't got a car, <strong>has he</strong>?</p></blockquote><h3>2. Chọn trợ động từ</h3><ul><li>Nếu câu chính có <em>be</em>, modal hoặc trợ động từ, lặp lại từ đó trong phần đuôi.</li><li>Nếu câu chính không có trợ động từ, dùng <strong>do/does/did</strong> theo thì và chủ ngữ.</li><li>Chủ ngữ ở phần đuôi phải là đại từ tương ứng.</li></ul><blockquote><p><strong>Ví dụ:</strong> Karen plays the piano, <strong>doesn't she</strong>?</p><p>You locked the door, <strong>didn't you</strong>?</p></blockquote><h3>3. Trường hợp đặc biệt</h3><ul><li><strong>I am → aren't I?</strong></li><li><strong>There is/are → isn't/aren't there?</strong></li><li><strong>Let's → shall we?</strong></li><li>Câu mệnh lệnh thường dùng <strong>will you?</strong>; lời mời có thể dùng <strong>won't you?</strong></li><li><em>never, nobody, no one, nothing, hardly, scarcely, little</em> mang nghĩa phủ định nên dùng đuôi khẳng định.</li><li><em>nothing/everything</em> → <strong>it</strong>; <em>everyone/someone/nobody/no one</em> → <strong>they</strong>.</li></ul><h3>4. Ngữ điệu</h3><p>Xuống giọng khi người nói chỉ mong người nghe xác nhận; lên giọng khi đó là câu hỏi thực sự và người nói chưa chắc thông tin.</p>	0
1a03369b-236d-4c49-b873-04d19962f01a	49	Subject-Verb Agreement	Sự hòa hợp giữa chủ ngữ và động từ	<h3>1. Quy tắc cơ bản</h3><p>Động từ phải hòa hợp với <strong>chủ ngữ thật</strong> về số. Cụm từ nằm giữa chủ ngữ và động từ không làm thay đổi số của chủ ngữ.</p><blockquote><p><strong>Ví dụ:</strong> The quality of these apples <strong>is</strong> not good. <em>(Chủ ngữ là quality, không phải apples.)</em></p></blockquote><h3>2. Chủ ngữ nối bằng liên từ</h3><ul><li>Hai chủ ngữ nối bằng <strong>and</strong> thường dùng động từ số nhiều.</li><li>Nếu hai từ chỉ cùng một người/vật hoặc được xem là một đơn vị, dùng số ít: <em>Bread and butter is my usual breakfast.</em></li><li>Với <strong>or, either...or, neither...nor, not only...but also</strong>, động từ thường hòa hợp với chủ ngữ gần nhất.</li><li><strong>as well as, together with, along with, accompanied by</strong> không làm thay đổi số của chủ ngữ chính.</li></ul><h3>3. Các từ chỉ lượng và đại từ bất định</h3><table><thead><tr><th>Dùng số ít</th><th>Dùng số nhiều</th></tr></thead><tbody><tr><td>each, every, either, neither, everyone, someone, nobody, anything</td><td>both, many, few, several</td></tr></tbody></table><ul><li><strong>Each/every + danh từ số ít</strong> dùng động từ số ít.</li><li><strong>All/some/most/half/percent + of</strong>: động từ theo danh từ sau <em>of</em>.</li><li><strong>A number of + danh từ số nhiều</strong> dùng số nhiều; <strong>the number of</strong> dùng số ít.</li></ul><h3>4. Danh từ và cụm danh từ đặc biệt</h3><ul><li><em>news, mathematics, physics</em> có hình thức số nhiều nhưng thường dùng động từ số ít.</li><li>Khoảng tiền, thời gian, quãng đường được xem là một đơn vị thường dùng số ít.</li><li>Danh từ tập hợp có thể dùng số ít khi xem nhóm là một đơn vị; dùng số nhiều khi nhấn mạnh từng thành viên, đặc biệt trong Anh-Anh.</li><li><em>There is/are</em>: động từ thường hòa hợp với danh từ đứng sau.</li></ul><blockquote><p><strong>Ví dụ:</strong> Neither the teacher nor the students <strong>are</strong> ready.</p><p>Ten kilometres <strong>is</strong> a long way to walk.</p><p>A number of students <strong>are</strong> absent, but the number of absentees <strong>is</strong> falling.</p></blockquote>	0
03aa13a7-c603-5363-9bad-fc8589bcc4b3	50	Functions of Nouns	Chức năng của danh từ trong câu	<h2>Chức năng của danh từ (Functions of Nouns)</h2><p>Danh từ có thể có những chức năng khác nhau trong câu. Dưới đây là các chức năng chính mà danh từ đảm nhận:</p><h3>1. Chủ ngữ của câu (Subject of a sentence)</h3><p>Chủ ngữ là danh từ, cụm danh từ hoặc đại từ chỉ ngôi, vật hoặc sự vật thực hiện hành động.</p><blockquote><p><strong>Ví dụ:</strong> The children have gone to bed. (Bọn trẻ đã đi ngủ cả rồi.)</p></blockquote><h3>2. Tân ngữ trực tiếp hoặc gián tiếp của câu (Direct object or indirect object of a sentence)</h3><ul><li><strong>Tân ngữ trực tiếp:</strong> Là danh từ nhận trực tiếp hành động của động từ.</li><blockquote><p><strong>Ví dụ:</strong> I saw the thief. (Tôi đã thấy tên trộm.)</p></blockquote><li><strong>Tân ngữ gián tiếp:</strong> Là danh từ nhận lợi ích của hành động từ.</li><blockquote><p><strong>Ví dụ:</strong> The policeman asked the thief a lot of questions. (Viên cảnh sát đã hỏi tên trộm rất nhiều câu hỏi.)</p></blockquote></ul><h3>3. Tân ngữ của giới từ (Object of a preposition)</h3><p>Danh từ nào ở sau giới từ cũng đều làm tân ngữ cho giới từ đó.</p><blockquote><p><strong>Ví dụ:</strong> He is listening to music. (Anh ấy đang nghe nhạc.)</p></blockquote><h3>4. Bổ ngữ của chủ ngữ (Subjective complement)</h3><p>Bổ ngữ của chủ ngữ là một bổ ngữ câu mệnh đề (complement of the clause) là danh từ, cụm danh từ hoặc tính từ mô tả chủ ngữ.</p><blockquote><p><strong>Ví dụ:</strong> He is my closest friend. (Anh ấy là người bạn thân nhất của tôi.)</p></blockquote><h3>5. Bổ ngữ của tân ngữ (Objective complement)</h3><p>Bổ ngữ của tân ngữ là một bổ ngữ nhằm mô tả tân ngữ.</p><blockquote><p><strong>Ví dụ:</strong> They elected him president of the club. (Họ bầu anh ấy làm chủ tịch câu lạc bộ.)</p></blockquote><h3>6. Một phần của cụm từ giới từ (Part of prepositional phrases)</h3><p>Cụm danh từ có thể trở thành một phần của cụm từ giới từ.</p><blockquote><p><strong>Ví dụ:</strong> The book is in an different tone. (Cuốn sách này ở một giọng điệu khác.)</p></blockquote><h3>7. Đứng trước và bổ sung cho danh từ khác (Appositive phrases)</h3><p>Tên ngữ dùng để làm rõ nghĩa cho danh từ khác.</p><blockquote><p><strong>Ví dụ:</strong> He told us about his father, a general, who died in the war. (Anh ấy kể cho chúng tôi nghe về cha của mình, một vị tướng, người đã hy sinh trong chiến tranh.)</p></blockquote>	1
f1b153a9-b9ab-55a4-aa6a-3d76a6c14b79	50	Noun Types and Formation	Các loại danh từ và cách thành lập	<h2>Các loại danh từ và cách thành lập (Noun Types and Formation)</h2><h3>I. Định nghĩa (Definition)</h3><p>Danh từ là từ hoặc nhóm từ dùng để chỉ người (John, teacher, mother,...), vật (chair, dog,...), nơi chốn (city, church, England,...), tình chất (beauty, courage, sorrow,...), hay hoạt động (travel, cough, walk,...).</p><h3>II. Các loại danh từ (Kinds of nouns)</h3><h4>1. Danh từ cụ thể và danh từ trừu tượng (Concrete nouns and abstract nouns)</h4> 1.1. Danh từ cụ thể (Concrete nouns) <p>Danh từ cụ thể là danh từ chỉ những gì hữu hình; như là những gì mà chúng ta có thể cảm nhận trực tiếp qua giác quan.</p><ul><li><strong>a. Danh từ chung (common nouns)</strong>: Danh từ dùng để gọi tên những sự vật thuộc cùng một loại.</li><blockquote><p><strong>Ví dụ:</strong> table (cái bàn), man (con người), dog (con chó).</p></blockquote><li><strong>b. Danh từ riêng (proper nouns)</strong>: Là tên riêng của những sự vật, đồ vật riêng lẻ.</li><blockquote><p><strong>Ví dụ:</strong> John, France (nước Pháp), the Thames (sông Thames).</p></blockquote></ul> 1.2. Danh từ trừu tượng (Abstract nouns) <p>Danh từ trừu tượng là danh từ dùng để chỉ tình chất, trạng thái hoặc hoạt động.</p><blockquote><p><strong>Ví dụ:</strong> beauty (vẻ đẹp), charity (thương người), existence (sự tồn tại).</p></blockquote><h4>2. Danh từ đếm được và danh từ không đếm được (Countable nouns and uncountable nouns)</h4> 2.1. Danh từ đếm được (Countable nouns) <p>Danh từ đếm được là danh từ chỉ những vật thể, có thể đếm được hoặc số ít và số nhiều.</p><blockquote><p><strong>Ví dụ:</strong> a book (một cuốn sách), two dogs (hai con chó).</p></blockquote> 2.2. Danh từ không đếm được (Uncountable nouns) <p>Danh từ không đếm được là danh từ chỉ những chất liệu, chất lỏng, những khái niệm trừu tượng, và những vật mà chúng ta xem như một khối không thể tách rời.</p><blockquote><p><strong>Ví dụ:</strong> wool (len), butter (bơ), water (nước).</p></blockquote><h4>3. Danh từ đơn và danh từ ghép (Simple nouns and compound nouns)</h4> 3.1. Danh từ đơn (Simple nouns) <p>Danh từ đơn là danh từ chỉ có một từ.</p><blockquote><p><strong>Ví dụ:</strong> house (ngôi nhà), peace (hòa bình).</p></blockquote> 3.2. Danh từ ghép (Compound nouns) <p>Danh từ ghép là danh từ gồm hai hoặc nhiều từ kết hợp với nhau.</p><blockquote><p><strong>Ví dụ:</strong> greenhouse (nhà kính), world peace (hòa bình thế giới).</p></blockquote> Cách thành lập danh từ ghép <ul><li>Danh từ + danh từ (noun + noun).</li><blockquote><p><strong>Ví dụ:</strong> toothpick (tăm).</p></blockquote><li>Tính từ + danh từ (adjective + noun).</li><blockquote><p><strong>Ví dụ:</strong> quicksilver (thủy ngân).</p></blockquote><li>Danh từ + động từ (noun + verb).</li><blockquote><p><strong>Ví dụ:</strong> weight-lifting (cử tạ).</p></blockquote></ul><h4>4. Danh từ số ít và danh từ số nhiều (Singular nouns and plural nouns)</h4><p>Danh từ thường có hai hình thức: số ít (singular) và số nhiều (plural).</p><pre><code>Ví dụ: - girl (cô gái) - singular - girls (các cô gái) - plural </code></pre> Cách thành lập danh từ số nhiều <ol><li>Thêm -s vào danh từ.</li><li>Các danh từ tân cùng với b, sh, ch, x, z được tạo thành số nhiều bằng cách thêm -es.</li><blockquote><p><strong>Ví dụ:</strong> dish (cái đĩa) - dishes (những cái đĩa).</p></blockquote></ol><h4>5. Các quy tắc đặc biệt về số nhiều (Irregular plurals)</h4><ul><li>Danh từ có hình thức đặc biệt cho số nhiều.</li><blockquote><p><strong>Ví dụ:</strong> man (đàn ông) - men (các đàn ông).</p></blockquote><li>Các danh từ không thay đổi hình thức.</li><blockquote><p><strong>Ví dụ:</strong> sheep (cừu) - sheep (các con cừu).</p></blockquote></ul>	0
f95009eb-3ce7-5d9f-a678-94633d665307	50	Possessive Case	Sở hữu cách	<h2>Sở hữu cách (Possessive Case)</h2><p>Sở hữu cách được dùng để diễn đạt sự sở hữu hoặc mối quan hệ của một đối tượng với một đối tượng khác.</p><h3>Cách thành lập sở hữu cách</h3><ol><li><strong>Thêm 's sau danh từ đơn số ít và danh từ số nhiều không tận cùng bằng -s:</strong><pre><code>Danh từ đơn số ít: danh từ + 's Danh từ số nhiều không tận cùng bằng -s: danh từ + s'</code></pre><blockquote><p><strong>Ví dụ:</strong> my father's car (xe ô tô của cha tôi), the children's room (phòng của bọn trẻ).</p></blockquote></li><li><strong>Thêm ' vào các danh từ số ít hoặc tên riêng tận cùng bằng -s:</strong><pre><code>Danh từ số ít: danh từ + 's Danh từ tận cùng bằng -s: danh từ + '</code></pre><blockquote><p><strong>Ví dụ:</strong> Charles's mother (mẹ của Charles), Joe's office (văn phòng của Joe).</p></blockquote></li></ol><h3>Cách dùng sở hữu cách 's và of + danh từ</h3><ul><li><strong>Cách dùng sở hữu cách:</strong> Sở hữu cách chủ yếu được dùng cho danh từ chỉ người hoặc động vật.</li><blockquote><p><strong>Ví dụ:</strong> the girl's name (tên của cô gái), Mr Evans's daughter (con gái của ông Evans).</p></blockquote><li><strong>Không dùng sở hữu cách khi danh từ chỉ sự vật hoặc ý tưởng:</strong></li><blockquote><p><strong>Ví dụ:</strong> the name of the book (tên sách), the result of the match (kết quả trận đấu).</p></blockquote><li><strong>Danh từ chỉ các châu lục, quốc gia, thành phố:</strong></li><blockquote><p><strong>Ví dụ:</strong> Europe’s population (dân số châu Âu), the city’s new theater (nhà hát mới của thành phố).</p></blockquote></ul><h3>Cách dùng ' + danh từ (of + noun)</h3><ol><li><strong>Cấu trúc ' + danh từ:</strong><pre><code>Danh từ + 's Danh từ + s'</code></pre><blockquote><p><strong>Ví dụ:</strong> a week's holiday (kỳ nghỉ dài một tuần), today’s paper (báo hôm nay).</p></blockquote></li><li><strong>Danh từ chỉ thời gian hoặc khoáng giá trị:</strong><pre><code>Danh từ + of + danh từ</code></pre><blockquote><p><strong>Ví dụ:</strong> the length of the bridge (độ dài của cầu), the price of the book (giá của quyển sách).</p></blockquote></li></ol><h3>Lưu ý</h3><ul><li>Cách sử dụng 's là điều bắt buộc khi danh từ chỉ sự vật có tên người (Tom, Susan, John, ...).</li><li>Thường không dùng một cách ngẫu nhiên giữa 's và cụm từ khác trong câu.</li><li>Khi sử dụng 's, cần đảm bảo sự kết hợp hợp lý với cấu trúc câu.</li></ul>	2
c44f7fed-77ad-5229-9365-8cdc3575ecfc	51	Demonstrative and Indefinite Pronouns	Đại từ chỉ định và đại từ bất định	<h2>Đại từ chỉ định và đại từ bất định</h2><h3>1. Đại từ chỉ định (Demonstrative Pronouns)</h3><ul><li>Đại từ chỉ định là những từ được dùng để chỉ ra vị trí hoặc định hướng của người hoặc vật trong không gian và thời gian.</li></ul><h4>Các loại đại từ chỉ định:</h4><table><thead><tr><th>Đại từ</th><th>Giải thích</th><th>Ví dụ</th></tr></thead><tbody><tr><td>This</td><td>Chỉ điều gì gần người nói.</td><td><blockquote><p><strong>Ví dụ:</strong> This is my book. (Đây là cuốn sách của tôi.)</p></blockquote></td></tr><tr><td>That</td><td>Chỉ điều gì xa người nói.</td><td><blockquote><p><strong>Ví dụ:</strong> That is your car. (Đó là xe của bạn.)</p></blockquote></td></tr><tr><td>These</td><td>Chỉ nhiều điều gì gần người nói.</td><td><blockquote><p><strong>Ví dụ:</strong> These are my shoes. (Đây là giày của tôi.)</p></blockquote></td></tr><tr><td>Those</td><td>Chỉ nhiều điều gì xa người nói.</td><td><blockquote><p><strong>Ví dụ:</strong> Those are her friends. (Đó là bạn của cô ấy.)</p></blockquote></td></tr></tbody></table><h4>Cách dùng:</h4><ul><li>Sử dụng "this" và "these" cho những điều gần gũi hơn với người nói.</li><li>Sử dụng "that" và "those" cho những điều xa hơn.</li></ul><h3>2. Đại từ bất định (Indefinite Pronouns)</h3><ul><li>Đại từ bất định được sử dụng khi không muốn hoặc không thể chỉ định một cá thể cụ thể.</li></ul><h4>Các loại đại từ bất định:</h4><table><thead><tr><th>Đại từ</th><th>Giải thích</th><th>Ví dụ</th></tr></thead><tbody><tr><td>Some</td><td>Chỉ một số lượng không xác định được.</td><td><blockquote><p><strong>Ví dụ:</strong> Some of the children are playing outside. (Một số trẻ em đang chơi ở bên ngoài.)</p></blockquote></td></tr><tr><td>Any</td><td>Thường được dùng trong câu hỏi hoặc phủ định.</td><td><blockquote><p><strong>Ví dụ:</strong> Do you have any questions? (Bạn có câu hỏi nào không?)</p></blockquote></td></tr><tr><td>All</td><td>Ý chỉ tất cả.</td><td><blockquote><p><strong>Ví dụ:</strong> All of the cookies are gone. (Tất cả bánh quy đã hết.)</p></blockquote></td></tr><tr><td>None</td><td>Chỉ không có gì cả.</td><td><blockquote><p><strong>Ví dụ:</strong> None of the answers were correct. (Không có đáp án nào là chính xác.)</p></blockquote></td></tr><tr><td>Most</td><td>Chỉ phần lớn, hầu hết.</td><td><blockquote><p><strong>Ví dụ:</strong> Most of the students passed the exam. (Hầu hết các sinh viên đã qua kỳ thi.)</p></blockquote></td></tr><tr><td>Each</td><td>Chỉ từng cá thể trong một nhóm.</td><td><blockquote><p><strong>Ví dụ:</strong> Each student received a book. (Mỗi sinh viên nhận được một cuốn sách.)</p></blockquote></td></tr><tr><td>Both</td><td>Chỉ cả hai.</td><td><blockquote><p><strong>Ví dụ:</strong> Both of my parents are teachers. (Cả hai bố mẹ tôi đều là giáo viên.)</p></blockquote></td></tr><tr><td>Either</td><td>Chỉ một trong hai.</td><td><blockquote><p><strong>Ví dụ:</strong> You can choose either book. (Bạn có thể chọn bất kỳ cuốn sách nào.)</p></blockquote></td></tr><tr><td>Neither</td><td>Chỉ không cái nào trong hai.</td><td><blockquote><p><strong>Ví dụ:</strong> Neither of the answers is correct. (Không có đáp án nào là chính xác.)</p></blockquote></td></tr></tbody></table><h4>Cách dùng:</h4><ul><li>Các đại từ bất định thường được theo sau bởi danh từ và được sử dụng với các động từ sao cho phù hợp với số ít hoặc số nhiều.</li><li>Các đại từ như "some", "any", "all", "none", "most" cần chú ý theo sau danh từ số nhiều hay số ít của chúng.</li></ul>	1
c84e6026-05dc-5f91-90f0-f86203b2d217	51	Personal, Possessive and Reflexive Pronouns	Đại từ nhân xưng, sở hữu và phản thân	<h2>Đại từ (Pronouns)</h2><h3>I. Định nghĩa</h3><p>Đại từ (pronouns) là từ dùng để thay thế cho danh từ.</p><h3>II. Các loại đại từ</h3><ul><li>Đại từ nhân xưng (personal pronouns)</li><li>Đại từ sở hữu (possessive pronouns)</li><li>Đại từ phản thân và đại từ nhân mạnh (reflexive and emphatic pronouns)</li><li>Đại từ chỉ định (demonstrative pronouns)</li><li>Đại từ nghi vấn (interrogative pronouns)</li><li>Đại từ liên hệ (relative pronouns)</li><li>Đại từ phân bổ (distributive pronouns)</li><li>Đại từ bất định (indefinite pronouns)</li><li>Đại từ hổ tương (reciprocal pronouns)</li></ul><h3>III. Đại từ nhân xưng (Personal Pronouns)</h3><h4>a. Hình thức (Form)</h4><table><thead><tr><th>Ngôi (Person)</th><th>Số ít (Singular)</th><th>Số nhiều (Plural)</th></tr></thead><tbody><tr><td>Chủ ngữ</td><td>I (tôi)</td><td>We (chúng tôi)</td></tr><tr><td>Tân ngữ</td><td>Me (tôi)</td><td>Us (chúng tôi)</td></tr><tr><td>Chủ ngữ</td><td>You (anh, chị, bạn)</td><td>You (các bạn)</td></tr><tr><td>Tân ngữ</td><td>You (anh, chị, bạn)</td><td>You (các bạn)</td></tr><tr><td>Chủ ngữ</td><td>He (anh ấy)</td><td>They (họ, chúng nó)</td></tr><tr><td>Tân ngữ</td><td>Him (anh ấy)</td><td>Them (họ, chúng nó)</td></tr><tr><td>Chủ ngữ</td><td>She (cô ấy)</td><td></td></tr><tr><td>Tân ngữ</td><td>Her (cô ấy)</td><td></td></tr><tr><td>Chủ ngữ</td><td>It (nó)</td><td></td></tr><tr><td>Tân ngữ</td><td>It (nó)</td><td></td></tr></tbody></table><h4>b. Cách dùng (Use)</h4><p>Đại từ nhân xưng được dùng để thay thế cho danh từ khi không cần thiết sử dụng hoặc lập lại chính xác danh từ đấy.</p><blockquote><p><strong>Ví dụ:</strong> John’s broken his leg. He’ll be in hospital for a few days. (John bị gãy chân. Anh ấy sẽ phải nằm viện vài ngày.)</p></blockquote><h4>IV. Đại từ sở hữu (Possessive Pronouns)</h4><h4>a. Hình thức (Form)</h4><table><thead><tr><th>Đại từ nhân xưng (Personal Pronouns)</th><th>Đại từ sở hữu (Possessive Pronouns)</th></tr></thead><tbody><tr><td>I (tôi)</td><td>mine (của tôi)</td></tr><tr><td>You (anh, chị, bạn)</td><td>yours (của bạn)</td></tr><tr><td>He (anh ấy)</td><td>his (của anh ấy)</td></tr><tr><td>She (cô ấy)</td><td>her (của cô ấy)</td></tr><tr><td>It (nó)</td><td>its (của nó)</td></tr><tr><td>We (chúng tôi)</td><td>ours (của chúng tôi)</td></tr><tr><td>You (các bạn)</td><td>yours (của các bạn)</td></tr><tr><td>They (họ)</td><td>theirs (của họ)</td></tr></tbody></table><h4>b. Cách dùng (Use)</h4><ul><li>Đại từ sở hữu được dùng không có danh từ theo sau.</li><li>Đại từ sở hữu cũng có thể được đứng trước danh từ mà không thay thế.</li></ul><blockquote><p><strong>Ví dụ:</strong> Can I borrow your keys? I can’t find mine. (Tôi có thể mượn chìa khóa của bạn không? Tôi không tìm thấy chìa khóa của tôi.)</p></blockquote><h4>V. Đại từ phản thân và đại từ nhân mạnh (Reflexive and Emphatic Pronouns)</h4><h4>a. Hình thức (Form)</h4><table><thead><tr><th>Đại từ nhân xưng (Personal Pronouns)</th><th>Đại từ phản thân (Reflexive Pronouns)</th><th>Đại từ nhân mạnh (Emphatic Pronouns)</th></tr></thead><tbody><tr><td>I (tôi)</td><td>myself (tự tôi)</td><td>myself (tự tôi)</td></tr><tr><td>You (anh, chị, bạn)</td><td>yourself (tự bạn)</td><td>yourself (tự bạn)</td></tr><tr><td>He (anh ấy)</td><td>himself (tự anh ấy)</td><td>himself (tự anh ấy)</td></tr><tr><td>She (cô ấy)</td><td>herself (tự cô ấy)</td><td>herself (tự cô ấy)</td></tr><tr><td>It (nó)</td><td>itself (tự nó)</td><td>itself (tự nó)</td></tr><tr><td>We (chúng tôi)</td><td>ourselves (tự chúng tôi)</td><td>ourselves (tự chúng tôi)</td></tr><tr><td>You (các bạn)</td><td>yourselves (tự các bạn)</td><td>yourselves (tự các bạn)</td></tr><tr><td>They (họ)</td><td>themselves (tự họ)</td><td>themselves (tự họ)</td></tr></tbody></table><h4>b. Cách dùng (Use)</h4><ul><li>Đại từ phản thân được dùng làm tân ngữ (object) của động từ khi hành động có chủ ngữ thực hiện lệch lạc ngày chính chủ ngữ.</li><li>Đại từ nhân mạnh nhằm nhấn mạnh chủ ngữ.</li></ul><blockquote><p><strong>Ví dụ:</strong> He said he couldn’t live without her. (Anh ấy nói anh ấy không thể sống thiếu cô ta.)</p></blockquote>	0
e3ad0784-e520-561b-99c8-be2bfda7c8e0	52	Position and Order of Adjectives	Vị trí và trật tự của tính từ	<h2>Vị trí và Trật tự của Tính từ (Position and Order of Adjectives)</h2><h3>I. Vị trí của Tính từ (Position of Adjectives)</h3><ul><li><strong>1.1. Vị trí thuộc ngữ (Attributive position):</strong> Tính từ đứng trước danh từ.</li><pre><code>Ex: The new secretary doesn’t like me.</code></pre><li><strong>1.2. Vị trí vị ngữ (Predicative position):</strong> Tính từ đứng sau các liên từ (linking verbs) như <em>be</em>, <em>become</em>, <em>seem</em>, <em>feel</em>, <em>look</em>, <em>taste</em>, <em>smell</em>, <em>appear</em>.</li><pre><code>Ex: The children seemed happy.</code></pre></ul><h3>II. Trật tự của Tính từ trước Danh từ (Order of Adjectives Before Nouns)</h3><p>Có một trật tự chung khi có nhiều tính từ đứng trước một danh từ, thường được sắp xếp theo thứ tự như sau:</p><table><thead><tr><th>Thứ tự</th><th>Nhóm</th><th>Ví dụ</th></tr></thead><tbody><tr><td>1</td><td>Determiners</td><td>a, the, this, my, those, some, several,...</td></tr><tr><td>2</td><td>Cardinal adjectives</td><td>one, four, ten,...</td></tr><tr><td>3</td><td>Opinion</td><td>lovely, nice, wonderful,...</td></tr><tr><td>4</td><td>Size</td><td>big, small, long, large,...</td></tr><tr><td>5</td><td>Quality</td><td>quiet, boring, shiny,...</td></tr><tr><td>6</td><td>Age</td><td>old, young, elderly,...</td></tr><tr><td>7</td><td>Shape</td><td>round, oval, triangular,...</td></tr><tr><td>8</td><td>Colour</td><td>red, blue, brown,...</td></tr><tr><td>9</td><td>Origin</td><td>Japanese, American,...</td></tr><tr><td>10</td><td>Material</td><td>stone, plastic, metal,...</td></tr><tr><td>11</td><td>Type</td><td>walking stick, kettle,...</td></tr><tr><td>12</td><td>Purpose</td><td>a bread knife, walking stick,...</td></tr></tbody></table><h3>III. Lưu ý về Trật tự Tính từ</h3><p>Khi có hai hoặc nhiều tính từ đều đứng trước danh từ, ta cần tuân theo trật tự trên.</p><blockquote><p><strong>Ví dụ:</strong> She bought two beautiful wooden picture frames.</p></blockquote><h3>IV. Tính từ được Dùng Như Danh Từ</h3><p>Một số tính từ có thể được dùng với <em>the</em> để nói về nhóm người trong xã hội.</p><blockquote><p><strong>Ví dụ:</strong> The poor are facing many challenges.</p></blockquote>	1
689c6bc9-460b-51f5-adef-b362c2de669d	53	Adverb Types, Functions and Position	Các loại, chức năng và vị trí của trạng từ	<h2>Các loại, chức năng và vị trí của trạng từ</h2><h3>I. Định nghĩa (Definition)</h3><p>Trạng từ là từ được dùng để cung cấp thêm thông tin về nơi chốn, thời gian, hoàn cảnh, cách thức, nguyên nhân, mức độ, v.v. cho một động từ, một tính từ, một cụm từ hoặc một trạng từ khác.</p><h3>II. Các loại trạng từ (Kinds of adverbs)</h3><p>Trạng từ có thể được phân loại theo ý nghĩa của chúng trong câu.</p><h4>1. Trạng từ chỉ cách thức (Adverbs of manner)</h4><p>Trạng từ chỉ cách thức cho biết sự việc xảy ra hoặc được thực hiện như thế nào. Trạng từ chỉ cách thức có thể được dùng ở vị trí trả lời cho các câu hỏi “how”.</p><pre><code>Ex: carefully (cẩn thận), angrily (giận dữ), noisily (ồn ào), badly (xấu, dở), fast (nhanh), slowly (chậm), suddenly (đột ngột)</code></pre><blockquote><p><strong>Ví dụ:</strong> She angrily tore up the letter. (Cô ấy giận dữ xé tan lá thư.)</p></blockquote><p>Trạng từ chỉ cách thức thường được thành lập bằng cách thêm đuôi -ly vào sau tính từ.</p><pre><code>Adjective + ly → Adverb Ex: bad + ly → badly (xấu, dở) happy + ly → happily (một cách hạnh phúc) </code></pre><h4>2. Trạng từ chỉ thời gian (Adverbs of time)</h4><p>Trạng từ chỉ thời gian cho biết sự việc xảy ra vào lúc nào. Trạng từ chỉ thời gian có thể được dùng để trả lời cho các câu hỏi về thời gian (when).</p><pre><code>Ex: today (hôm nay), tomorrow (ngày mai), recently (gần đây), three days ago (ba ngày trước đây)</code></pre><blockquote><p><strong>Ví dụ:</strong> We’ll leave on Monday morning. (Sáng thứ Hai chúng ta sẽ đi.)</p></blockquote><h4>3. Trạng từ chỉ nơi chốn (Adverbs of place)</h4><p>Trạng từ chỉ nơi chốn cho biết sự việc xảy ra ở nơi nào. Trạng từ chỉ nơi chốn có thể được dùng để trả lời cho câu hỏi “where”.</p><pre><code>Ex: upstairs (trên lầu), around (quanh), here (đây), somewhere (đâu đó)</code></pre><blockquote><p><strong>Ví dụ:</strong> The children are playing upstairs. (Bọn trẻ đang chơi trên lầu.)</p></blockquote><h4>4. Trạng từ chỉ tần suất (Adverbs of Frequency)</h4><p>Trạng từ chỉ tần suất cho biết sự việc xảy ra thường xuyên như thế nào.</p><pre><code>Ex: always (luôn luôn), usually (thường xuyên), sometimes (thỉnh thoảng), never (không bao giờ)</code></pre><blockquote><p><strong>Ví dụ:</strong> She has never written to me. (Cô ấy chưa bao giờ viết thư cho tôi.)</p></blockquote><h4>5. Trạng từ chỉ mức độ (Adverbs of degree)</h4><p>Trạng từ chỉ mức độ cho biết mức độ (rất, nhiều, ...) của một tính chất hoặc mức độ đặc tính.</p><pre><code>Ex: too (quá), very (rất), quite (khá), enough (đủ), really (thực sự), just (chỉ, đúng)</code></pre><blockquote><p><strong>Ví dụ:</strong> I'm very pleased with your success. (Tôi rất vui với thành công của bạn.)</p></blockquote><h4>6. Trạng từ nghi vấn (Interrogative adverbs)</h4><p>Trạng từ nghi vấn là các trạng từ dùng để đặt câu hỏi: Where, when, why, how.</p><pre><code>Ex: Where do you live? (Bạn sống ở đâu?)</code></pre><blockquote><p><strong>Ví dụ:</strong> When have we got a history lesson? (Khi nào chúng ta có giờ lịch sử?)</p></blockquote><h4>7. Trạng từ quan hệ (Relative adverbs)</h4><p>Trạng từ quan hệ hắt hiu khi (mà, khi), where (nơi mà), why (vì sao) có thể được dùng để giới thiệu các mệnh đề quan hệ sau các danh từ chỉ thời gian (when), nơi chốn (where) và lý do (why).</p><pre><code>Ex: I’ll never forget the day when I first met you. (Tôi sẽ không bao giờ quên cái ngày mà tôi gặp anh lần đầu.)</code></pre><blockquote><p><strong>Ví dụ:</strong> I know a shop where you can find sandals. (Tôi biết một cửa hàng mà bạn có thể tìm được dép xăng-đan.)</p></blockquote><h3>III. Chức năng của trạng từ (Functions of adverbs)</h3><ul><li>Bổ nghĩa cho động từ</li><li>Bổ nghĩa cho tính từ</li><li>Bổ nghĩa cho trạng từ khác</li><li>Bổ nghĩa cho cụm giới từ</li><li>Bổ nghĩa cho cả câu</li></ul><h3>IV. Vị trí của trạng từ (Positions of Adverbs)</h3><p>Trạng từ có thể đứng ở vị trí trong câu.</p><h4>1. Vị trí đầu câu (front position)</h4><p>Các trạng từ nghi vấn (when, where, why, how) và trạng từ chỉ thời gian cũng thường đứng ở vị trí đầu câu để kết nối.</p><blockquote><p><strong>Ví dụ:</strong> Where do you live? (Bạn sống ở đâu?)</p></blockquote><h4>2. Vị trí giữa câu (mid position)</h4><p>Một số các trạng từ như trạng từ chỉ tần suất, trạng từ chỉ mức độ, trạng từ chỉ cách thức có thể đứng ở vị trí giữa câu – nghĩa là:</p><pre><code>Ex: We usually go to Scotland in August. (Chúng tôi thường đi Scotland vào tháng 8.)</code></pre><h4>3. Vị trí cuối câu (end position)</h4><p>Trạng từ chỉ cách thức, thời gian, nơi chốn, và tần suất thường đứng ở vị trí cuối câu.</p><pre><code>Ex: Tom eats his breakfast quickly. (Tom ăn sáng nhanh.)</code></pre>	0
ea768c0f-ec9b-509a-9d92-6f9eaba3899f	53	Inversion after Adverbs	Đảo ngữ sau trạng từ	<h2>IV. Phép đảo động từ sau các trạng từ (Inversion of the verb after adverbs)</h2><p>Phép đảo động từ là sự đảo ngược vị trí giữa chủ ngữ và động từ trong câu. Hình thức đảo động từ được thực hiện dưới các trường hợp sau:</p><h3>a. Trạng từ chỉ điều kiện</h3><p>Khi sử dụng trạng từ chỉ điều kiện, dạng câu thường là:</p><pre><code>Under no circumstances + trợ động từ + chủ ngữ + động từ chính.</code></pre><p><strong>Ví dụ:</strong> Under no circumstances must this switch be touched.</p><h3>b. Trạng từ hạn chế</h3><p>Các trạng từ như <em>hardly</em>, <em>seldom</em>, <em>rarely</em>, <em>little</em>, <em>never</em> thường sử dụng cấu trúc:</p><pre><code>Never + trợ động từ + chủ ngữ + động từ chính.</code></pre><p><strong>Ví dụ:</strong> Never does my father drink coffee in the evening.</p><h3>c. Cụm từ <strong>So + tính từ/adverb + that + mệnh đề</strong></h3><p>Cấu trúc của cụm này là:</p><pre><code>So + tính từ/adverb + trợ động từ + chủ ngữ + động từ chính.</code></pre><p><strong>Ví dụ:</strong> So ridiculous did she look that everybody burst out laughing.</p><h3>d. Một số trạng từ, trạng ngữ thường được theo sau bởi hình thức đảo ngữ:</h3><table><thead><tr><th>Trạng từ</th><th>Hình thức đảo ngữ</th></tr></thead><tbody><tr><td>hardly</td><td>Hardly had I finished my homework when...</td></tr><tr><td>scarce</td><td>Scarce had I seen the news when...</td></tr><tr><td>not only</td><td>Not only did we lose our money, but we were nearly killed.</td></tr><tr><td>only if</td><td>Only if we work together can we succeed.</td></tr></tbody></table><p><strong>Lưu ý:</strong> Khi sử dụng nhiều trạng từ hoặc cụm trạng từ ở vị trí cuối câu, trạng từ đơn thường cần đứng trước động từ.</p><pre><code>I hardly saw her at lunch-time.</code></pre><p><strong>Ví dụ:</strong> I worked hard yesterday.</p>	1
135bb7ce-093e-5f8e-98dc-21f4b72eba36	54	Verb Types and Primary Auxiliaries	Các loại động từ và trợ động từ chính	<h2>ĐỘNG TỪ (VERBS)</h2><h3>I. Định nghĩa (Definition)</h3><p>Động từ (verbs) là từ hoặc cụm từ được dùng để diễn tả hành động (action) hoặc trạng thái (state).</p><h3>II. Các loại động từ (Kinds of verbs)</h3><p>Dựa trên các tiêu chí khác nhau, động từ có thể được phân thành nhiều loại.</p><h4>1. Ngoại động từ và nội động từ (Transitive and intransitive verbs)</h4><ul><li><strong>Ngọai động từ (Transitive verbs)</strong> diễn tả hành động được thực hiện trực tiếp lên người nào đó hoặc vật nào đó; nội cách khác, ngoại động từ là động từ thường được theo sau bởi danh từ chỉ tân ngữ trực tiếp (direct object).<br><strong>Ví dụ:</strong><blockquote>Let's invite Sally. (Chúng ta hãy mời Sally.)</blockquote><blockquote>You surprised me. (Anh làm tôi ngạc nhiên.)</blockquote></li><li><strong>Nội động từ (Intransitive verbs)</strong> diễn tả hành động được thực hiện bởi người hoặc người thực hiện hành động đó; nội cách khác, nội động từ là động từ không cần có tân ngữ trực tiếp (danh từ chỉ tân ngữ) theo sau.<br><strong>Ví dụ:</strong><blockquote>The children are playing. (Bọn trẻ đang chơi đùa.)</blockquote></li></ul><p><strong>Chú ý:</strong> Nhiều động từ có thể vừa là ngoại động từ vừa là nội động từ (nghĩa của chúng có thể thay đổi).</p><blockquote>Ex: We lost the match. (Chúng tôi đã thua trận đấu.)</blockquote><h4>1.2. Động từ quy tắc và động từ bất quy tắc (Regular and irregular verbs)</h4><ul><li><strong>Động từ quy tắc (Regular verbs)</strong> là động từ có hình thức quá khứ đơn (simple past) và quá khứ phân từ (past participle) được thành lập bằng cách thêm -ed vào động từ nguyên mẫu (infinitive).<br><strong>Ví dụ:</strong><pre><code>work (làm việc) - worked - worked</code></pre></li><li><strong>Động từ bất quy tắc (Irregular verbs)</strong> là động từ có hình thức quá khứ đơn và quá khứ phân từ không theo quy tắc nhất định nào. Hình thức quá khứ đơn và quá khứ phân từ của động từ này nằm trong bảng động từ bất quy tắc (người học phải học thuộc bảng động từ bất quy tắc).<br><strong>Ví dụ:</strong><pre><code>be (thì, là) - was/were - been</code></pre></li></ul><h3>2. Trợ động từ và động từ thường (Auxiliary and ordinary verbs)</h3><h4>2.1. Trợ động từ (Auxiliary verbs)</h4><p>Trợ động từ là động từ có chức năng đặc biệt (special verbs) be, have, do, can, may, must, ought, shall, will, need, dare, used được chia thành hai nhóm:</p><ul><li><strong>Động từ thường (ordinary verbs)</strong> là động từ có chức năng độc lập.</li><li><strong>Động từ chính (Principal auxiliary verbs)</strong> gồm be, do, have, được dùng để thành lập các câu hỏi hoặc phủ định.</li></ul><blockquote>Ex: <strong>Be</strong> được thêm vào động từ khác để tạo thành thể tiếp diễn hoặc bị động.<br><pre><code>am, is, are / was, were / been</code></pre></blockquote><h4>2.2. Động từ chính và trợ động từ (Main and auxiliary verbs)</h4><p><strong>Do</strong> được dùng để thành lập câu hỏi, câu phủ định và nhằm nhấn mạnh của các động từ không có trợ động từ.</p><p><strong>Ví dụ:</strong></p><blockquote>Do you smoke? (Anh có hút thuốc không?)</blockquote><br><h4>3. Các động từ be/do/have</h4><table><thead><tr><th>Infinitive</th><th>Present Tense</th><th>Past Tense</th><th>Past Participle</th></tr></thead><tbody><tr><td>to be</td><td>am, is, are</td><td>was, were</td><td>been</td></tr><tr><td>to do</td><td>do, does</td><td>did</td><td>done</td></tr><tr><td>to have</td><td>have, has</td><td>had</td><td>had</td></tr></tbody></table><p><strong>Chú ý:</strong> Các động từ này rất quan trọng và được sử dụng rộng rãi trong câu tiếng Anh.</p>	0
e0d8ca9a-05c5-5704-a90f-cc8b349d9b2c	54	Participles and Linking Verbs	Phân từ và hệ từ	<h2>Phân từ và Hệ từ (Participles and Linking Verbs)</h2><h3>1. Phân từ (Participles)</h3><p>Phân từ là hình thức của động từ được sử dụng trong các thì tiếp diễn và hoàn thành, hoặc được dùng như một tính từ để mô tả danh từ.</p><h4>1.1. Hiện tại phân từ (Present Participle)</h4><p>Hiện tại phân từ được thành lập bằng cách thêm <code> -ing</code> vào động từ nguyên mẫu.</p><pre><code>work → working love → loving interest → interesting excite → exciting</code></pre><h4>1.2. Cách dùng hiện tại phân từ</h4><ul><li>Được sử dụng để tạo thành các thì tiếp diễn (progressive tenses).</li><blockquote><p><strong>Ví dụ:</strong> It is <code>working</code> at the moment.</p></blockquote><li>Diễn tả trạng thái hoặc cảm xúc:</li><blockquote><p><strong>Ví dụ:</strong> George has become very <code>boring</code>.</p></blockquote><li>Như một tính từ hoặc trạng từ:</li><blockquote><p><strong>Ví dụ:</strong> He walked along <code>whistling</code> a happy tune.</p></blockquote></ul><h4>1.3. Chú ý</h4><ul><li>Hiện tại phân từ có thể thay thế chủ ngữ + động từ ở dạng chủ động (subject + active verb).</li><blockquote><p><strong>Ví dụ:</strong> We had to stand in a queue <code>waiting</code> for the bank open.</p></blockquote></ul><h4>1.4. Quá khứ phân từ (Past Participle)</h4><p>Quá khứ phân từ được thành lập bằng cách thêm <code>-ed</code> vào động từ quy tắc hoặc dạng bất quy tắc của động từ.</p><pre><code>work → worked see → seen go → gone</code></pre><h4>1.5. Cách dùng quá khứ phân từ</h4><ul><li>Được sử dụng trong các thì hoàn thành:</li><blockquote><p><strong>Ví dụ:</strong> I have <code>seen</code> the film.</p></blockquote><li>Như một tính từ:</li><blockquote><p><strong>Ví dụ:</strong> The police have found the <code>stolen</code> jewellery.</p></blockquote></ul><h3>2. Hệ từ (Linking Verbs)</h3><p>Hệ từ là loại động từ đặc biệt, kết nối chủ ngữ với bổ ngữ (subject complement).</p><h4>2.1. Các động từ liên kết thông dụng</h4><ul><li>be, become, seem, look, feel, sound, smell, taste, get</li></ul><h4>2.2. Cách sử dụng hệ từ</h4><ul><li>Trong câu mô tả trạng thái:</li><blockquote><p><strong>Ví dụ:</strong> My father is a doctor.</p></blockquote><li>Miêu tả tình trạng:</li><blockquote><p><strong>Ví dụ:</strong> It's <code>getting</code> dark.</p></blockquote><li>Nhấn mạnh hành động:</li><blockquote><p><strong>Ví dụ:</strong> You look very <code>unhappy</code>.</p></blockquote></ul><h4>2.3. Lưu ý</h4><p>Một số hệ từ cũng có thể được dùng như động từ thường, nhưng có ý nghĩa khác biệt. Cách sử dụng cẩn thận để tránh nhầm lẫn.</p><blockquote><p><strong>Ví dụ:</strong> The boss looked at me angrily.</p></blockquote>	1
f6b4e725-fb5d-5579-bc9f-a1b94cd4e5ec	51	Interrogative and Relative Pronouns	Đại từ nghi vấn và đại từ quan hệ	<h2>Đại từ nghi vấn và đại từ quan hệ</h2><h3>I. Đại từ nghi vấn (Interrogative Pronouns)</h3><p>Đại từ nghi vấn được sử dụng để đặt câu hỏi với các thông tin cụ thể. Những đại từ này bao gồm:</p><ul><li><strong>What: cái gì</strong></li><li><strong>Who</strong>: ai</li><li><strong>Whom</strong>: ai/about whom (dùng trong ngữ cảnh trang trọng)</li><li><strong>Whose</strong>: của ai</li><li><strong>Which</strong>: cái nào</li><li><strong>Where</strong>: ở đâu</li><li><strong>When</strong>: khi nào</li><li><strong>Why</strong>: tại sao</li><li><strong>How</strong>: như thế nào</li></ul><h4>Cách sử dụng</h4><ul><li>Sử dụng đại từ nghi vấn để yêu cầu thông tin cụ thể.</li><li>Ví dụ: <blockquote><strong>Ví dụ:</strong> Who is coming to the party? (Ai sẽ đến bữa tiệc?)</blockquote></li></ul><h3>II. Đại từ quan hệ (Relative Pronouns)</h3><p>Đại từ quan hệ được sử dụng để liên kết một mệnh đề hoặc một câu với một danh từ, cụ thể là:</p><ul><li><strong>Who</strong>: người (dùng cho chủ ngữ)</li><li><strong>Whom</strong>: người (dùng cho tân ngữ)</li><li><strong>Whose</strong>: của ai</li><li><strong>Which</strong>: cái nào (dùng cho sự vật)</li><li><strong>That</strong>: cái đó (có thể dùng cho người/ sự vật)</li></ul><h4>Cách dùng</h4><ul><li>Đại từ quan hệ giúp mô tả thêm thông tin về danh từ đứng trước nó.</li><li>Ví dụ: <blockquote><strong>Ví dụ:</strong> The man who is speaking is my father. (Người đàn ông đang nói là cha tôi.)</blockquote></li></ul><h3>III. Phân biệt giữa đại từ nghi vấn và đại từ quan hệ</h3><table><thead><tr><th>Đại từ nghi vấn</th><th>Đại từ quan hệ</th></tr></thead><tbody><tr><td>Dùng trong câu hỏi.</td><td>Dùng để liên kết câu với danh từ.</td></tr></tbody></table><h3>IV. Lưu ý về cách dùng</h3><ul><li><strong>Khi sử dụng who và whom:</strong> 'Who' thường được dùng như chủ ngữ, còn 'whom' thường được dùng như tân ngữ.</li><li><strong>Whose:</strong> Được sử dụng để chỉ sở hữu.</li></ul><h3>V. Một số trường hợp đặc biệt</h3><ul><li><strong>That:</strong> Có thể thay thế cho 'who' và 'which' trong một số ngữ cảnh.</li><li><strong>Where:</strong> Có thể dùng trong ngữ cảnh chỉ địa điểm trong câu hỏi hoặc mệnh đề quan hệ.</li></ul>	2
2668d9b8-e985-5cf4-88db-0064a2e059a2	52	Adjective Types and Uses	Các loại và cách dùng tính từ	<h2>TÍNH TỪ (ADJECTIVES)</h2><h3>I. Định nghĩa (Definition)</h3><p>Tính từ (adjectives) là từ chỉ tính chất của người, vật, hoặc sự việc được biểu thị bằng một danh từ hoặc đại từ.</p><h3>II. Các loại tính từ (Kinds of adjectives)</h3><p>Dựa trên các tiêu chí khác nhau, tính từ có thể được phân thành:</p><h4>1. Tính từ mô tả và tính từ giới hạn (Descriptive adjectives and limiting adjectives)</h4><h4>1.1. Tính từ mô tả (Descriptive adjectives)</h4><p>Là tính từ được dùng để mô tả hình dáng, kích thước, phẩm chất, đặc tính, màu sắc ... của người, vật.</p><blockquote><p><strong>Ví dụ:</strong> The man is a rich businessman. (Người đàn ông đó là một doanh nhân giàu có.)</p></blockquote><h4>1.2. Tính từ giới hạn (Limiting adjectives)</h4><p>Là tính từ được dùng để đặt giới hạn cho danh từ mà nó bổ nghĩa. Tính từ giới hạn gồm:</p><ul><li><b>Từ xác định hoặc tính từ chỉ sở hữu (Possessive determiners/adjectives):</b><pre><code>I my you your he his she its it its we our they their </code></pre><blockquote><p><strong>Ví dụ:</strong> Have you seen my new coat? (Bạn có thấy cái áo khoác mới của tôi không?)</p></blockquote></li><li><b>Tính từ chỉ định (Demonstrative determiners/adjectives):</b> this, that, these, those. <blockquote><p><strong>Ví dụ:</strong> I like these earrings. Where did you get them? (Tôi thích đôi hoa tai này. Bạn mua ở đâu vậy?)</p></blockquote></li><li><b>Other + danh từ số ít / số nhiều (singular / plural noun):</b><blockquote><p><strong>Ví dụ:</strong> Mrs Stanley has three other children. (Bà Stanley có ba đứa trẻ khác.)</p></blockquote></li><li><b>Another + danh từ số ít (singular noun):</b><blockquote><p><strong>Ví dụ:</strong> I must find myself another job. (Tôi phải tìm công việc khác.)</p></blockquote></li><li><b>The other + danh từ số ít (singular countable noun):</b><blockquote><p><strong>Ví dụ:</strong> The insurance office is on the other side of the street. (Công ty bảo hiểm ở bên kia đường.)</p></blockquote></li><li><b>The other + danh từ số nhiều:</b><blockquote><p><strong>Ví dụ:</strong> Both books are interesting. (Cả hai cuốn sách đều hay.)</p></blockquote></li></ul><h4>2. Tính từ thuộc ngữ và tính từ vị ngữ (Attributive adjectives and predicative adjectives)</h4><h4>2.1. Tính từ thuộc ngữ (attributive adjectives)</h4><p>Là tính từ đứng trước danh từ.</p><blockquote><p><strong>Ví dụ:</strong> He's a nice man. (Ông ấy là người tốt.)</p></blockquote><h4>2.2. Tính từ vị ngữ (predicative adjectives)</h4><p>Là tính từ theo sau các từ như to be, become, feel, look, get, seem,…</p><blockquote><p><strong>Ví dụ:</strong> She was asleep. (Cô ấy đang ngủ.)</p></blockquote><h4>3. Tính từ đơn và tính từ ghép (Simple adjectives and compound adjectives)</h4><h4>3.1. Tính từ đơn (simple adjectives)</h4><p>Là tính từ chỉ có một từ.</p><blockquote><p><strong>Ví dụ:</strong> beautiful (xinh đẹp), good (tốt), sad (buồn).</p></blockquote><h4>3.2. Tính từ ghép (compound adjectives)</h4><p>Là tính từ được tạo thành lập bằng cách kết hợp hai hoặc nhiều từ lại với nhau và được viết:</p><pre><code>life + long = lifelong </code></pre><blockquote><p><strong>Ví dụ:</strong> duty-free (miễn thuế) world-famous (nổi tiếng khắp thế giới).</p></blockquote><h4>4. Tình trạng và chức năng của tính từ (Position and functions of adjectives)</h4><h4>4.1. Vị trí của tính từ (Position of adjectives)</h4><ol><li><b>Vị trí thuộc ngữ (attributive position):</b> đứng trước danh từ. <blockquote><p><strong>Ví dụ:</strong> The new secretary doesn’t like me. (Người thư ký mới không thích tôi.)</p></blockquote></li><li><b>Vị trí vị ngữ (predicative position):</b> đứng sau các liên từ (linking verbs). <blockquote><p><strong>Ví dụ:</strong> The children seemed happy. (Bọn trẻ có vẻ rất vui.)</p></blockquote></li></ol><h4>5. Phân tích các loại tính từ (Categorizing adjectives)</h4><p>Là cách xác định việc học tập và sử dụng các kiểu tính từ khác nhau.</p>	0
677cc65d-415c-5207-bc30-5332b850afae	38	Present Perfect Continuous	Thì hiện tại hoàn thành tiếp diễn	<h2>IV. Thì hiện tại hoàn thành tiếp diễn (The Present Perfect Progressive Tense)</h2><h3>1. Cấu trúc (Form)</h3><ul><li><strong>a. Thì khẳng định (Affirmative form)</strong><pre><code>I, We, You, They + have + been + verb-ing</code></pre><pre><code>He, She, It + has + been + verb-ing</code></pre><p><strong>Ví dụ:</strong> It has been raining all day. (Trời mưa suốt ngày.)</p></li><li><strong>b. Thì phủ định (Negative form)</strong><pre><code>Subject + have/has + not + been + verb-ing</code></pre><p><strong>Ví dụ:</strong> We have not been playing very well lately. (Gần đây chúng tôi chơi không tốt lắm.)</p></li><li><strong>c. Thể nghi vấn (Interrogative form)</strong><pre><code>Have/Has + subject + been + verb-ing?</code></pre><p><strong>Ví dụ:</strong> Have you been waiting long? (Bạn đợi có lâu không?)</p></li></ul><h3>2. Cách dùng (Use)</h3><ul><li><strong>a. Hành động bắt đầu trong quá khứ và kéo dài liên tục đến hiện tại.</strong><p><strong>Ví dụ:</strong> We have been waiting here for twenty minutes. (Chúng tôi đã đợi ở đây hơn mười phút rồi.)</p></li><li><strong>b. Hành động vừa mới chấm dứt và có kết quả ở hiện tại.</strong><p><strong>Ví dụ:</strong> I’ve been swimming. That’s why my hair is wet. (Tôi đã bơi. Đó là lý do tóc tôi ướt.)</p></li><li><strong>c. Hành động xảy ra nhiều lần từ quá khứ đến hiện tại.</strong><p><strong>Ví dụ:</strong> Sarah has been playing/has played the piano since she was five. (Sarah đã chơi đàn piano từ lúc lên năm.)</p></li></ul>	3
c24975ca-e5c0-5935-bcf1-6b3a63e197ae	38	Past Continuous	Thì quá khứ tiếp diễn	<h2>Thì quá khứ tiếp diễn (Past Continuous)</h2><h3>1. Định nghĩa</h3><p>Thì quá khứ tiếp diễn được sử dụng để diễn tả một hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ.</p><h3>2. Cấu trúc</h3><h4>a. Câu khẳng định</h4><pre><code>Subject + was/were + verb-ing</code></pre><p><strong>Ví dụ:</strong> I was doing my homework at 6 p.m. last Sunday.</p><h4>b. Thể phủ định</h4><pre><code>Subject + was/were + not + verb-ing</code></pre><p><strong>Ví dụ:</strong> She wasn’t looking.</p><h4>c. Thể nghi vấn</h4><pre><code>Was/Were + subject + verb-ing?</code></pre><p><strong>Ví dụ:</strong> What were you doing at 10 o’clock last night?</p><h3>3. Cách dùng</h3><ul><li><strong>a. Hành động đang diễn ra tại một thời điểm cụ thể:</strong><p><strong>Ví dụ:</strong> I was doing my homework at 6 p.m. last Sunday.</p></li><li><strong>b. Hành động đang diễn ra kéo dài liên tục trong một khoảng thời gian trong quá khứ:</strong><p><strong>Ví dụ:</strong> Yesterday, Mr Smith was working in the laboratory all afternoon.</p></li><li><strong>c. Hành động đang diễn ra vào một thời điểm trong quá khứ thì một hành động quá khứ xảy ra đột ngột:</strong><p><strong>Ví dụ:</strong> When I came yesterday, he was sleeping.</p></li><li><strong>d. Hành động lập đi lập lại liên tục trong quá khứ:</strong><p><strong>Ví dụ:</strong> He was always ringing me up.</p></li><li><strong>e. Hành động xảy ra trong một khoảng thời gian nhất định:</strong><p><strong>Ví dụ:</strong> I was cooking while my sister was washing the dishes.</p></li></ul><h3>4. Lưu ý</h3><p>Khi sử dụng thì quá khứ tiếp diễn, hành động diễn ra kéo dài thường được đối chiếu với thì quá khứ đơn (past simple) khi có hành động khác chen vào.</p>	5
7abedb57-1db4-5e6e-b812-3e01aa6fbd89	38	Past Perfect Continuous	Thì quá khứ hoàn thành tiếp diễn	<h2>Thì quá khứ hoàn thành tiếp diễn (Past Perfect Continuous)</h2><h3>1. Định nghĩa</h3><p>Thì quá khứ hoàn thành tiếp diễn được sử dụng để diễn tả một hành động đã xảy ra liên tục và kéo dài đến một thời điểm cụ thể trong quá khứ.</p><h3>2. Cách dùng</h3><ul><li>Mô tả hành động đã xảy ra liên tục trước một thời điểm xác định trong quá khứ.</li><li>Nhấn mạnh sự kéo dài của một hành động đến thời điểm trong quá khứ.</li></ul><h3>3. Công thức</h3><h4>a. Khẳng định (Affirmative form)</h4><pre><code>Subject + had been + verb-ing</code></pre><h4>b. Phủ định (Negative form)</h4><pre><code>Subject + had not (hadn't) been + verb-ing</code></pre><h4>c. Nghi vấn (Interrogative form)</h4><pre><code>Had + subject + been + verb-ing?</code></pre><h3>4. Lưu ý</h3><ul><li>Thì này thường đi kèm với những từ chỉ thời gian như "for" và "since" để chỉ khoảng thời gian kéo dài.</li><li>Khi sử dụng, cần chú ý đến thời điểm trong quá khứ mà hành động diễn ra.</li></ul><h3>5. Ví dụ</h3><blockquote><p><strong>Ví dụ:</strong> She had been studying for three hours before the exam started. (Cô ấy đã học suốt ba giờ trước khi kỳ thi bắt đầu.)</p></blockquote><blockquote><p><strong>Ví dụ:</strong> They had been waiting for the bus when it started to rain. (Họ đã chờ xe buýt khi trời bắt đầu mưa.)</p></blockquote><h3>6. Điểm phân biệt</h3><table><thead><tr><th>Thì</th><th>Định nghĩa</th><th>Sự kéo dài</th></tr></thead><tbody><tr><td>Quá khứ hoàn thành</td><td>Sự việc xảy ra trước một thời điểm trong quá khứ.</td><td>Không nhấn mạnh tính kéo dài.</td></tr><tr><td>Quá khứ hoàn thành tiếp diễn</td><td>Sự việc đã xảy ra liên tục trước một thời điểm trong quá khứ.</td><td>Nhấn mạnh tính kéo dài của sự việc.</td></tr></tbody></table>	7
7c73a5c1-62b4-54dc-80c0-314af909f519	38	Future Continuous	Thì tương lai tiếp diễn	<h2>Thì Tương Lai Tiếp Diễn (The Future Continuous)</h2><h3>1. Cấu Trúc (Form)</h3><ul><li><strong>Thể khẳng định (Affirmative form)</strong><br><pre><code> Subject + will/shall + be + verb-ing </code></pre></li><li><strong>Thể phủ định (Negative form)</strong><br><pre><code> Subject + won’t/shan’t + be + verb-ing </code></pre></li><li><strong>Thể nghi vấn (Interrogative form)</strong><br><pre><code> Will/Shall + subject + be + verb-ing? </code></pre></li></ul><h3>2. Cách Dùng (Use)</h3><p>Thì tương lai tiếp diễn được dùng để diễn tả:</p><ol><li><strong>Hành động đang xảy ra tại một thời điểm hoặc trong một khoảng thời gian cụ thể ở tương lai:</strong><br><p><strong>Ví dụ:</strong><blockquote>Tuần tới, vào giờ này tôi đang nằm trên bãi biển.</blockquote></p></li><li><strong>Hành động tương lai đang xảy ra ra một hành động khác xảy đến:</strong><br><p><strong>Ví dụ:</strong><blockquote>Băng nhạc sẽ đang chơi khi Tổng thống bước vào.</blockquote></p></li><li><strong>Hành động xảy ra và kéo dài liên tục trong một khoảng thời gian ở tương lai:</strong><br><p><strong>Ví dụ:</strong><blockquote>Cha mẹ tôi sẽ ở London, vì vậy tôi sẽ ở với bà ngoại trong hai tuần tới.</blockquote></p></li><li><strong>Hành động sẽ xảy ra như một phần trong kế hoạch hoặc phần trong thời gian biểu:</strong><br><p><strong>Ví dụ:</strong><blockquote>Buổi tiệc sẽ bắt đầu lúc 10 giờ.</blockquote></p></li></ol>	9
3e4c58f3-a6b2-5159-9f60-c91694075c7f	38	Future Perfect	Thì tương lai hoàn thành	<h2>Thì tương lai hoàn thành (The Future Perfect)</h2><h3>1. Cấu trúc (Form)</h3><ul><li><strong>a. Thể khẳng định (Affirmative form)</strong><pre><code>Subject + will/shall + have + past participle</code></pre></li><li><strong>b. Thể phủ định (Negative form)</strong><pre><code>Subject + won’t/shan't + have + past participle</code></pre></li><li><strong>c. Thể nghi vấn (Interrogative form)</strong><pre><code>Will/Shall + subject + have + past participle?</code></pre></li></ul><h3>2. Cách dùng (Use)</h3><ul><li><strong>a. Hành động sẽ được hoàn tất trước một thời điểm hoặc trước một hành động khác trong tương lai.</strong><p><strong>Ví dụ:</strong><blockquote>They will have built that house by July next year.</blockquote><blockquote>When you come back she will have finished college.</blockquote></p></li><li><strong>b. Hành động xảy ra và kéo dài đến một thời điểm trong tương lai.</strong><p><strong>Ví dụ:</strong><blockquote>By the end of this month they will have lived here for four years.</blockquote><blockquote>She will have learned English for 6 months when the course finishes this week.</blockquote></p></li></ul><h3>3. Lưu ý</h3><p>Thì tương lai hoàn thành không dùng để diễn tả một cảm nhận hay thời gian, thời hiện tại hoàn thành được dùng để thay thế.</p><p><strong>Ví dụ:</strong><blockquote>I will go with you when I have finished my homework.</blockquote></p>	10
9b450ce6-1482-58b3-a44e-d0168348c140	38	Future Perfect Continuous	Thì tương lai hoàn thành tiếp diễn	<h2>Thì tương lai hoàn thành tiếp diển (The Future Perfect Continuous Tense)</h2><h3>1. Cấu trúc (Form)</h3><ul><li><strong>a. Thể khẳng định (Affirmative form)</strong>: <pre><code>Subject + will/shall + have been + verb-ing</code></pre></li><li><strong>b. Thể phủ định (Negative form)</strong>: <pre><code>Subject + won't/shan't + have been + verb-ing</code></pre></li><li><strong>c. Thể nghi vấn (Interrogative form)</strong>: <pre><code>Will/Shall + subject + have been + verb-ing?</code></pre></li></ul><h3>2. Cách dùng (Use)</h3><p>Thì tương lai hoàn thành tiếp diễn được sử dụng để diễn tả một hành động sẽ xảy ra và kéo dài liên tục đến một thời điểm nào đó trong tương lai.</p><blockquote><p><strong>Ví dụ:</strong> By March 15th, I’ll have been working for this company for 6 years. (Đến ngày 15 tháng Ba, tôi sẽ (đã) làm việc cho công ty này được 6 năm.)</p></blockquote><p>Thì này thường được dùng với các cụm từ chỉ thời gian bắt đầu bằng by.</p><h3>3. Lưu ý (Notes)</h3><ul><li>Không nên nhầm lẫn thì này với thì tương lai hoàn thành (Future Perfect Tense) vì nó nhấn mạnh đến sự kéo dài của hành động.</li></ul><h4>4. Bảng so sánh các thì tương lai</h4><table><thead><tr><th>Thì</th><th>Cấu trúc</th><th>Cách dùng</th></tr></thead><tbody><tr><td>Thì tương lai đơn (Simple Future)</td><td><pre><code>Subject + will + verb</code></pre></td><td>Diễn tả hành động sẽ xảy ra trong tương lai.</td></tr><tr><td>Thì tương lai hoàn thành (Future Perfect)</td><td><pre><code>Subject + will have + verb-ed</code></pre></td><td>Diễn tả hành động sẽ hoàn thành trước thời điểm trong tương lai.</td></tr><tr><td>Thì tương lai hoàn thành tiếp diễn (Future Perfect Continuous)</td><td><pre><code>Subject + will have been + verb-ing</code></pre></td><td>Diễn tả hành động sẽ kéo dài liên tục đến một thời điểm trong tương lai.</td></tr></tbody></table>	11
a4511b06-c5a0-5163-8335-feb66d5e380f	38	Adding -ed and -ing	Cách thêm đuôi -ed và -ing	<h2>Cách thêm đuôi -ed và -ing (Adding -ed and -ing)</h2><h3>1. Động từ tận cùng bằng -e</h3><ul><li><strong>Đuôi -ed:</strong> thêm d</li><blockquote><p><strong>Ví dụ:</strong> hope → hoped, decide → decided, die → died</p></blockquote><li><strong>Đuôi -ing:</strong> bỏ e và thêm -ing</li><blockquote><p><strong>Ví dụ:</strong> take → taking, drive → driving</p></blockquote></ul><h3>2. Động từ có một âm tiết tận cùng bằng một nguyên âm và một phụ âm</h3><ul><li><strong>Đuôi -ed:</strong> gấp đôi phụ âm</li><blockquote><p><strong>Ví dụ:</strong> stop → stopped, plan → planned</p></blockquote><li><strong>Đuôi -ing:</strong> gấp đôi phụ âm và thêm -ing</li><blockquote><p><strong>Ví dụ:</strong> stop → stopping, plan → planning</p></blockquote></ul><h3>3. Động từ tận cùng bằng hai phụ âm</h3><ul><li><strong>Đuôi -ed:</strong> thêm -ed</li><blockquote><p><strong>Ví dụ:</strong> plow → plowed, fix → fixed</p></blockquote><li><strong>Đuôi -ing:</strong> thêm -ing</li><blockquote><p><strong>Ví dụ:</strong> play → playing, fix → fixing</p></blockquote></ul><h3>4. Động từ tận cùng bằng một âm tiết tận cùng bằng nguyên âm và một phụ âm</h3><ul><li><strong>Đuôi -ed:</strong> đôi khi thay -y và thêm -ed</li><blockquote><p><strong>Ví dụ:</strong> hurry → hurried, study → studied</p></blockquote></ul><h3>5. Những trường hợp đặc biệt</h3><ul><li>Đối với từ có hai âm tiết và âm tiết thứ hai nhấn mạnh, quy tắc tương tự như trên được áp dụng.</li><li>Những động từ kết thúc bằng -y cần giữ nguyên -y khi thêm -ed hoặc -ing.</li></ul>	12
46d82477-1213-514c-8626-f57444ccb50b	38	Sequence of Tenses	Sự phối hợp thì	<h2>Sự phối hợp thì (The Sequence of Tenses)</h2><p>Một câu có thể bao gồm một mệnh đề chính (main clause) và một hoặc nhiều mệnh đề phụ (subordinate clause). Khi trong câu có từ hàm ý để chỉ thời gian, thì các động từ phải có sự phối hợp về thì.</p><h3>I. Sự phối hợp của các động từ trong mệnh đề chính và mệnh đề phụ</h3><table><thead><tr><th>MAIN CLAUSE</th><th>SUBORDINATE CLAUSE</th></tr></thead><tbody><tr><td>Present simple</td><td>Present simple, Present progressive, Present perfect, Future simple</td></tr><tr><td>Future simple</td><td>am/is/are going to + V (bare-inf.)</td></tr><tr><td>Past simple</td><td>Past perfect, Past simple</td></tr><tr><td>Present perfect</td><td>Present simple, Past simple</td></tr><tr><td>Past perfect</td><td>Present simple, Past simple</td></tr></tbody></table><p><strong>Ví dụ:</strong> I work so hard that I am always tired. (Tôi làm việc vất vả đến nỗi tôi luôn cảm thấy mệt mỏi.)</p><h3>II. Sự phối hợp của các động từ trong mệnh đề chính và mệnh đề phụ để trạng ngữ chỉ thời gian (adverbial clause of time)</h3><table><thead><tr><th>MAIN CLAUSE</th><th>ADVERBIAL CLAUSE OF TIME</th></tr></thead><tbody><tr><td>Present tenses</td><td>Present tenses</td></tr><tr><td>Past tenses</td><td>Past tenses</td></tr><tr><td>Future tenses</td><td>Present tenses</td></tr></tbody></table><h4>1. Present tenses</h4><p>Tất cả các thì hiện tại (tùy theo ngữ cảnh câu).</p><p><strong>Ví dụ:</strong> He never goes home before he has finished his work. (Anh ta không bao giờ về nhà trước khi hoàn thành công việc.)</p><h4>2. Past tenses</h4><p>Tất cả các thì quá khứ (tùy theo ngữ cảnh).</p><p><strong>Ví dụ:</strong> It was raining hard when I got there. (Khi tôi đến trời đang mưa rất to.)</p><h4>3. Future tenses</h4><p>Tất cả các thì tương lai (tùy theo ngữ cảnh).</p><p><strong>Ví dụ:</strong> We will give you a call as soon as we arrive/ have arrived. (Chúng tôi sẽ gọi cho bạn ngay khi chúng tôi đến.)</p>	14
7758c99d-e984-5e34-8688-bc2cb14b6650	57	Wish and If Only	Mệnh đề sau wish và if only	<h2>Mệnh đề sau Wish và If Only</h2><h3>1. Ao ước tương lai (Future wish)</h3><p>Mệnh đề này dùng để diễn đạt ước muốn về điều gì đó sẽ xảy ra hoặc mong người nào đó làm điều gì đó.</p><pre><code> Subject + wish(es) + subject + would + verb (bare-inf) </code></pre><blockquote><p><strong>Ví dụ:</strong> I wish you would stop smoking. (Tôi mong anh bỏ thuốc lá.)</p><p><strong>Ví dụ:</strong> If only Jane would take the trip with me next Sunday. (Ước gì Chủ nhật tới Jane đi du lịch với tôi.)</p></blockquote><p><strong>Lưu ý:</strong> Chủ ngữ của wish không được cùng chủ ngữ với do đó thường ta không thể nói I wish I would ... nhưng chúng ta có thể dùng câu khác.</p><h3>2. Ao ước hiện tại (Present wish)</h3><p>Mệnh đề này diễn đạt mong ước về một điều không có thật hoặc không thể xảy ra trong hiện tại.</p><pre><code> Subject + wish(es) + subject + verb (past simple) </code></pre><blockquote><p><strong>Ví dụ:</strong> I wish I were rich. (Ước gì tôi giàu.)</p><p><strong>Ví dụ:</strong> I wish I could swim. (Ước gì tôi biết bơi.)</p></blockquote><h3>3. Ao ước quá khứ (Past wish)</h3><p>Mệnh đề này diễn đạt mong ước về một điều gì đó đã xảy ra trong quá khứ điều hiển nhiên xảy ra nhưng không xảy ra.</p><pre><code> Subject + wish(es) + subject + verb (past perfect) </code></pre><blockquote><p><strong>Ví dụ:</strong> I wish I hadn't failed my exam last year. (Giá như năm ngoái tôi đã không thi rớt.)</p><p><strong>Ví dụ:</strong> If only I had met her yesterday. (Giá như hôm qua tôi đã gặp cô ấy.)</p></blockquote><p><strong>Lưu ý:</strong> Chúng ta có thể dùng could have + past participle để diễn tả mong ước về quá khứ.</p><blockquote><p><strong>Ví dụ:</strong> I wish I could have been at the wedding, but I was in New York. (Tôi ước tôi đã có thể dự đám cưới, nhưng tôi ở New York.)</p></blockquote><p>Mệnh đề có if only có thể dùng một cách linh hoạt trong các điều kiện.</p><blockquote><p><strong>Ví dụ:</strong> If only I wasn't/were so fat. (Giá mà tôi không quá mập.)</p><p><strong>Ví dụ:</strong> He wished he knew her address. (Anh ấy ước gì anh ta biết địa chỉ của cô ấy.)</p></blockquote>	0
729c62be-cf33-589b-8a56-ef071df9b87c	57	Result Phrases and Clauses	Cụm từ và mệnh đề chỉ kết quả	<h2>Cụm từ và mệnh đề chỉ kết quả (Phrases and Clauses of Result)</h2><h3>I. Cụm từ chỉ kết quả (Phrases of result)</h3><h4>1. TOO (quá, không thể)</h4><p>TOO được dùng trước tính từ (adjective) hoặc trạng từ (adverb) để chỉ mức độ.</p><pre><code>too + adj/adv + to-infinitive</code></pre><blockquote><p><strong>Ví dụ:</strong> He is too short to play basketball. (Anh ta quá thấp không thể chơi bóng rổ được.)</p><p>Tim spoke too quickly to understand. (Tim nói nhanh quá không thể hiểu được.)</p><p>Andrew spent too much time working. (Andrew đã dành quá nhiều thời gian cho công việc.)</p></blockquote><h4>2. ENOUGH (đủ, để có thể)</h4><p>ENOUGH được dùng sau tính từ và trạng từ.</p><pre><code>adj/adv + enough + to-infinitive</code></pre><blockquote><p><strong>Ví dụ:</strong> Mary is old enough to do what she wants. (Mary đã đủ lớn để có thể làm những gì cô ta muốn.)</p><p>He didn't jump high enough to win a prize. (Anh ta nhảy chưa đủ cao để có thể đoạt giải.)</p><p>I have enough strength to lift that box. (Tôi đủ khỏe để nhấc cái thùng đó.)</p></blockquote><p>ENOUGH cũng có thể được dùng không có danh từ theo sau nếu như nghĩa của câu đã rõ ràng.</p><h4>Lưu ý</h4><p>Cấu trúc có thể được dùng sau TOO và ENOUGH:</p><table><thead><tr><th>Cấu trúc</th><th>Ví dụ</th></tr></thead><tbody><tr><td>too + adj/adv</td><td>This game is too difficult for children. (Trò chơi này quá khó đối với bọn trẻ.)</td></tr><tr><td>adj/adv + enough for + noun/pronoun (+ to-infinitive)</td><td>I have enough experience for the job. (Anh ấy có kinh nghiệm đủ cho công việc.)</td></tr></tbody></table><h3>II. Mệnh đề trạng ngữ chỉ kết quả (Adverb clauses of result)</h3><h4>1. SO ... THAT (quá đến nỗi)</h4><p>Mệnh đề SO ... THAT được dùng để chỉ kết quả do hành động của mệnh đề chính gây ra.</p><pre><code>Subject + verb + so + adj/adv + that + subject + verb</code></pre><blockquote><p><strong>Ví dụ:</strong> It was so dark that I couldn’t see anything. (Trời tối đến nỗi tôi không thể nhìn thấy gì.)</p><p>He spoke so fast that nobody could understand him. (Anh ta nói nhanh đến nỗi không ai hiểu được.)</p></blockquote><p>Khi tính từ là nhiều, rất ít, hoặc là số lượng đếm được, sử dụng cấu trúc như sau:</p><pre><code>so + many/few/little + noun + that + subject + verb</code></pre><blockquote><p><strong>Ví dụ:</strong> She had so many children that she couldn’t remember their dates of birth. (Bà ta có quá nhiều con đến nỗi bà ta không thể nhớ ngày sinh của chúng.)</p></blockquote><h4>2. SUCH ... THAT (quá đến nỗi)</h4><p>Mệnh đề SUCH ... THAT được sử dụng tương tự như SO ... THAT để diễn tả kết quả.</p><pre><code>S + V + such (a/an) + adjective + noun + that + S + V</code></pre><blockquote><p><strong>Ví dụ:</strong> It was such a hot day that we decided to stay indoors. (Trời nóng đến nỗi chúng tôi quyết định ở nhà không đi đâu cả.)</p></blockquote>	2
9e7d8e8a-9fc8-5389-80a9-3b947a40847d	60	Noun and Adjective Formation	Cách thành lập danh từ và tính từ	<h2>Cách thành lập danh từ và tính từ</h2><h3>I. Thành lập danh từ (Noun Formations)</h3><p>Nhiều danh từ được hình thành bằng cách thêm các hậu tố (suffixes) vào động từ. Dưới đây là các quy tắc và ví dụ cụ thể:</p><h4>1. Các hậu tố phổ biến</h4><table><thead><tr><th>Hậu tố</th><th>Ví dụ</th><th>Ý nghĩa</th></tr></thead><tbody><tr><td>-ion / -ation</td><td><code>to prevent → prevention</code></td><td>sự ngăn ngừa</td></tr><tr><td>-ment</td><td><code>to develop → development</code></td><td>sự phát triển</td></tr><tr><td>-ence / -ance</td><td><code>to exist → existence</code></td><td>sự tồn tại</td></tr><tr><td>-er / -or</td><td><code>to teach → teacher</code></td><td>giáo viên</td></tr><tr><td>-ee</td><td><code>to employ → employee</code></td><td>nhân viên</td></tr><tr><td>-age</td><td><code>to drain → drainage</code></td><td>sự thoát nước</td></tr><tr><td>-ship</td><td><code>friend → friendship</code></td><td>tình bạn</td></tr><tr><td>-ism</td><td><code>capital → capitalism</code></td><td>chủ nghĩa tư bản</td></tr><tr><td>-ity</td><td><code>possibility → possibility</code></td><td>sự có thể</td></tr><tr><td>-ness</td><td><code>rich → richness</code></td><td>sự giàu có</td></tr><tr><td>-super</td><td><code>man → superman</code></td><td>siêu nhân</td></tr></tbody></table><h3>II. Thành lập tính từ (Adjective Formations)</h3><p>Có nhiều cách để hình thành tính từ bằng cách thêm các hậu tố (suffixes) vào danh từ. Dưới đây là các quy tắc chi tiết:</p><h4>1. Các hậu tố phổ biến để hình thành tính từ</h4><table><thead><tr><th>Hậu tố</th><th>Ví dụ</th><th>Ý nghĩa</th></tr></thead><tbody><tr><td>-ful</td><td><code>harm → harmful</code></td><td>có hại</td></tr><tr><td>-less</td><td><code>child → childless</code></td><td>không có con</td></tr><tr><td>-ly</td><td><code>friend → friendly</code></td><td>thân thiện</td></tr><tr><td>-able</td><td><code>read → readable</code></td><td>có thể đọc được</td></tr><tr><td>-ic</td><td><code>dramatic → dramatic</code></td><td>thuộc kịch</td></tr><tr><td>-ic / -al</td><td><code>historical → historical</code></td><td>thuộc lịch sử</td></tr><tr><td>-ous</td><td><code>fame → famous</code></td><td>nổi tiếng</td></tr><tr><td>-like</td><td><code>child → childlike</code></td><td>giống như trẻ em</td></tr><tr><td>-ness</td><td><code>kind → kindness</code></td><td>sự tốt bụng</td></tr></tbody></table>	0
e27111fd-7f8a-5e57-9ce9-273d448baf33	60	Word Forms	Hình thức của từ	<h2>HÌNH THỨC CỦA TỪ (WORD FORMS)</h2><p>Dưới đây là cách nhận biết các loại từ và cách sử dụng của chúng trong câu.</p><h3>I. Danh từ (Nouns)</h3><p>Danh từ thường được đặt ở các vị trí sau:</p><ol><li>Chủ ngữ câu (Subject of sentence)</li><blockquote><p><strong>Ví dụ:</strong> Computers are being used in all kinds of work.</p></blockquote><li>Sau tính từ hoặc tính từ sở hữu (his, my, her,...)</li><blockquote><p><strong>Ví dụ:</strong> She is a good teacher.</p></blockquote><li>Sau enough</li><blockquote><p><strong>Ví dụ:</strong> He hasn't got enough patience to wait.</p></blockquote><li>Sau các đại từ a, an, the, hoặc các từ hạn định khác (this, that, these, those, each, every, both, no,...)</li><blockquote><p><strong>Ví dụ:</strong> The scientists have become important people in our society.</p></blockquote></ol><h3>II. Tính từ (Adjectives)</h3><p>Tính từ thường đứng ở các vị trí sau:</p><ol><li>Trước danh từ</li><blockquote><p><strong>Ví dụ:</strong> His father is a mechanical engineer.</p></blockquote><li>Sau động từ liên kết (linking verb: be, get, seem, appear, feel, taste, look, smell,...)</li><blockquote><p><strong>Ví dụ:</strong> She is beautiful.</p></blockquote><li>Sau too</li><blockquote><p><strong>Ví dụ:</strong> He is too short to play basketball.</p></blockquote><li>Trước enough</li><blockquote><p><strong>Ví dụ:</strong> The water isn't hot enough.</p></blockquote><li>Trong cấu trúc so...that</li><blockquote><p><strong>Ví dụ:</strong> She was so angry that she couldn't speak.</p></blockquote></ol><h3>III. Trạng từ (Adverbs)</h3><p>Trạng từ thường đứng ở các vị trí:</p><ol><li>Sau trợ động từ (auxiliary verbs) và trước động từ thường (ordinary verbs)</li><blockquote><p><strong>Ví dụ:</strong> The pictures have definitely been stolen.</p></blockquote><li>Trước tính từ</li><blockquote><p><strong>Ví dụ:</strong> I’m truthfully grateful for your help.</p></blockquote><li>Sau too</li><blockquote><p><strong>Ví dụ:</strong> She walked too slowly to catch the bus.</p></blockquote><li>Trong cấu trúc so...that</li><blockquote><p><strong>Ví dụ:</strong> Jack drove so fast that he caused an accident.</p></blockquote><li>Đứng cuối câu.</li><blockquote><p><strong>Ví dụ:</strong> It was raining heavily.</p></blockquote></ol><h3>IV. Động từ (Verbs)</h3><p>Vị trí của động từ trong câu rất dễ nhận biết nếu thường đứng sau chủ ngữ.</p><blockquote><p><strong>Ví dụ:</strong> The girl sitting beside Tom has won the gold medal.</p></blockquote><h3>THÀNH NGỮ (IDIOMATIC EXPRESSIONS)</h3><p>Cấu trúc thành ngữ thường có dạng:</p><pre><code>Verb + noun (phrase) + preposition</code></pre> ``` This structure captures all vital information on the topic of "Word Forms" as per your instructions, while maintaining a clear and coherent format.	2
47087e51-2418-596d-ac36-dd23bcfd7310	55	Phrasal Verbs	Cụm động từ: ý nghĩa và cách dùng	<h2>CỤM ĐỘNG TỪ (PHRASAL VERBS)</h2><h3>I. Định nghĩa (Definition)</h3><p>Cụm động từ (phrasal verbs) là một động từ kết hợp với một trạng từ (adverb) hoặc một giới từ (preposition), hoặc đôi khi cả hai, để tạo thành một động từ mới thường có nghĩa đặc biệt.</p><pre><code>Ex: come in (vào trong), take off (cởi ra), look forward to (mong chờ).</code></pre><h3>II. Nghĩa của cụm động từ (Meaning of phrasal verbs)</h3><p>Một số cụm động từ có nghĩa rõ ràng và dễ hiểu vì nghĩa của chúng dựa trên nghĩa thường dùng của động từ và trạng từ hoặc giới từ.</p><pre><code>Ex: Would you like to come in and have a drink? (Anh vào nhà uống chút gì nhé?)</code></pre><p>Ví dụ khác:</p><pre><code>Ex: The man in front turned round and stared at me. (Người đàn ông phía trước quay lại nhìn tôi chăm chăm.)</code></pre><h4>Cụm động từ và cách thức sử dụng</h4><p>- Cụm động từ (verb + adverb) thường có nghĩa khác biệt và không thể tách rời động từ ra khỏi trạng từ.</p><pre><code>Ex: She tore up the letter. (Cô ấy xé lá thư.)</code></pre><h3>III. Cách dùng (Use)</h3><p>Phần lớn các cụm động từ thường được dùng trong hội thoại, thay cho những từ cũng chính nghĩa nhưng nghèo nàn về trình trọng hơn.</p><pre><code>Ex: What time are you planning to turn up? (Bạn định đến lúc mấy giờ?)</code></pre><p>Ví dụ khác:</p><pre><code>Ex: Please let us know when you plan to arrive. (Vui lòng cho chúng tôi biết bạn đến khi nào sẽ đến.)</code></pre><h4>Các trường hợp đặc biệt</h4><ul><li>Cụm động từ có thể là ngoại động từ (transitive) hoặc nội động từ (intransitive). Một số cụm động từ chỉ có thể được dùng cả hai cách.</li><li>Ví dụ: <blockquote><p><strong>Ví dụ:</strong> She tore up the letter. (Cô ấy xé lá thư.) [transitive]</p></blockquote></li><li>Nếu tân ngữ là đại từ (me, it, him, them,...), tân ngữ luôn được đặt trước trạng từ.</li><li>Ví dụ: <blockquote><p><strong>Ví dụ:</strong> She read the letter and then tore it up. (Cô ấy đọc lá thư rồi xé nó.) [NOT – tore up it.] </p></blockquote></li></ul><h3>IV. Một số cụm động từ thường dùng</h3><table><thead><tr><th>Cụm động từ</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead><tbody><tr><td>account for</td><td>là lý do hoặc giải thích nguyên nhân</td><td><blockquote><p><strong>Ví dụ:</strong> His illness accounted for his absence. (Đau ốm là lý do anh ấy vắng mặt.)</p></blockquote></td></tr><tr><td>bear out</td><td>xác nhận; chứng thực</td><td><blockquote><p><strong>Ví dụ:</strong> His witnesses will bear out what I say. (Một số người sẽ chứng thực lời tôi nói.)</p></blockquote></td></tr><tr><td>break down</td><td>máy hỏng, hỏng (cửa, tường)</td><td><blockquote><p><strong>Ví dụ:</strong> His car broke down on the way to the airport. (Xe của anh ấy bị hỏng trên đường ra phi trường.)</p></blockquote></td></tr><tr><td>bring in</td><td>giới thiệu (introduce)</td><td><blockquote><p><strong>Ví dụ:</strong> They’re going to bring in a new law against drinking and driving. (Họ sẽ đưa ra một đạo luật mới chống lại việc lái xe khi say rượu.)</p></blockquote></td></tr><tr><td>call in</td><td>ghé thăm; ghé qua</td><td><blockquote><p><strong>Ví dụ:</strong> Call in on your way home to tell me how the interview went. (Trên đường về hãy ghé qua cho tôi biết cuộc phỏng vấn diễn ra như thế nào nhé.)</p></blockquote></td></tr><tr><td>fall out</td><td>tranh cãi; cãi nhau</td><td><blockquote><p><strong>Ví dụ:</strong> They fell out over a trivial matter. (Họ đã tranh cãi về một vấn đề tầm thường.)</p></blockquote></td></tr><tr><td>get over</td><td>vượt qua; khắc phục</td><td><blockquote><p><strong>Ví dụ:</strong> He used to be afraid of heights but he has got over that now. (Trước đây anh ấy sợ độ cao, nhưng nay anh ấy đã khắc phục được.)</p></blockquote></td></tr><tr><td>keep on</td><td>tiếp tục</td><td><blockquote><p><strong>Ví dụ:</strong> My sister kept on asking me question after question. (Em gái tôi cứ liên tục hỏi tôi hết câu này đến câu khác.)</p></blockquote></td></tr><tr><td>look forward to</td><td>mong chờ</td><td><blockquote><p><strong>Ví dụ:</strong> I’m really looking forward to seeing my family again. (Tôi rất mong được gặp lại gia đình.)</p></blockquote></td></tr></tbody></table>	0
6a382e0b-06df-53ff-8b14-0e1753d63239	46	Dependent Prepositions	Giới từ theo sau tính từ, danh từ và động từ	<h2>Giới từ theo sau tính từ, danh từ và động từ (Dependent Prepositions)</h2><h3>1. Tính từ + giới từ</h3><p>Các tính từ có thể đi kèm với giới từ để tạo thành nghĩa cụ thể. Dưới đây là danh sách các tính từ thường đi kèm với giới từ:</p><table><thead><tr><th>Tính từ</th><th>Giới từ</th><th>Nghĩa</th></tr></thead><tbody><tr><td>ashamed</td><td>of</td><td>xấu hổ về</td></tr><tr><td>afraid</td><td>of</td><td>sợ hãi về</td></tr><tr><td>confident</td><td>of</td><td>tin tưởng vào</td></tr><tr><td>interested</td><td>in</td><td>quan tâm đến</td></tr><tr><td>good</td><td>at</td><td>giỏi về</td></tr></tbody></table><p><strong>Ví dụ:</strong> She is afraid of the dark. (Cô ấy sợ bóng tối.)</p><h3>2. Danh từ + giới từ</h3><p>Các danh từ cũng thường đi kèm với giới từ để chỉ ra mối quan hệ hoặc ý nghĩa cụ thể:</p><table><thead><tr><th>Danh từ</th><th>Giới từ</th><th>Nghĩa</th></tr></thead><tbody><tr><td>advantage</td><td>of</td><td>lợi ích của</td></tr><tr><td>relationship</td><td>with</td><td>mối quan hệ với</td></tr><tr><td>solution</td><td>to</td><td>giải pháp cho</td></tr><tr><td>involvement</td><td>in</td><td>sự tham gia vào</td></tr></tbody></table><p><strong>Ví dụ:</strong> My advantage over others is my experience. (Lợi thế của tôi so với những người khác là kinh nghiệm của tôi.)</p><h3>3. Động từ + giới từ</h3><p>Nhiều động từ cũng có thể đi kèm với giới từ, tạo thành cụm động từ thể hiện hành động nhất định:</p><table><thead><tr><th>Động từ</th><th>Giới từ</th><th>Nghĩa</th></tr></thead><tbody><tr><td>apologize</td><td>to</td><td>xin lỗi ai về việc gì</td></tr><tr><td>belong</td><td>to</td><td>thuộc về</td></tr><tr><td>care</td><td>about</td><td>quan tâm đến</td></tr><tr><td>look forward</td><td>to</td><td>mong đợi</td></tr></tbody></table><p><strong>Ví dụ:</strong> I apologize to you for my mistake. (Tôi xin lỗi bạn về sai lầm của mình.)</p>	1
365339d5-8348-5014-974d-fcb051a9bc25	56	Conjunction Types and Uses	Các loại liên từ và cách dùng	<h2>LIÊN TỪ (CONJUNCTIONS)</h2><h3>I. Định nghĩa (Definition)</h3><p>Liên từ (conjunction) là từ được dùng để nối các từ, cụm từ, mệnh đề hoặc câu.</p><pre><code>Ví dụ: and (và), but (nhưng), or (hoặc)</code></pre><h3>II. Các loại liên từ (Kinds of conjunctions)</h3><p>Liên từ được phân thành hai loại: Liên từ kết hợp (Co-ordinating conjunctions) và liên từ phụ thuộc (subordinating conjunctions).</p><h4>1. Liên từ kết hợp (Co-ordinating conjunctions)</h4><p>Liên từ kết hợp là những từ chức năng giống nhau (danh từ với danh từ, động từ với động từ, tính từ với tính từ...) hoặc các mệnh đề độc lập với nhau.</p><ul><li><b>Nhóm AND:</b> chỉ sự thêm vào</li><p>Có thể kể đến: <pre><code>and</code></pre>, <strong>in addition</strong>, <strong>as well as</strong>.</p><blockquote><p><strong>Ví dụ:</strong> Arlene Black has a yacht and a helicopter. In addition, she has five cars.</p></blockquote><li><b>Nhóm BUT:</b> chỉ sự mâu thuẫn hoặc trái ngược</li><p>Có thể kể đến: <pre><code>but</code></pre>, <strong>yet</strong>, <strong>still</strong>.</p><blockquote><p><strong>Ví dụ:</strong> She worked hard, yet she failed.</p></blockquote><li><b>Nhóm OR:</b> chỉ sự lựa chọn hoặc đoàn chung</li><p>Có thể kể đến: <pre><code>or</code></pre>, <strong>otherwise</strong>.</p><blockquote><p><strong>Ví dụ:</strong> Which color do you want - red, yellow, or grey?</p></blockquote><li><b>Nhóm SO:</b> chỉ hậu quả, kết quả</li><p>Có thể kể đến: <pre><code>so</code></pre>, <strong>therefore</strong>.</p><blockquote><p><strong>Ví dụ:</strong> There weren’t enough beds, so we had to sleep on the floor.</p></blockquote></ul><h4>2. Liên từ phụ thuộc (Subordinating conjunctions)</h4><p>Liên từ phụ thuộc được sử dụng để đầu một mệnh đề phụ (mệnh đề đã không hoàn chỉnh để trạng từ).</p><ul><li>Các liên từ: <pre><code>when</code></pre>, <pre><code>since</code></pre>, <pre><code>as</code></pre>, <pre><code>because</code></pre>.</li><blockquote><p><strong>Ví dụ:</strong> I’ll phone as soon as I get home from work.</p></blockquote><li><b>Nhóm BECAUSE:</b> chỉ nguyên nhân hoặc lý do</li><blockquote><p><strong>Ví dụ:</strong> I tried to help him because I liked him.</p></blockquote><li><b>Nhóm IF:</b> chỉ điều kiện</li><blockquote><p><strong>Ví dụ:</strong> If you need help, just let me know.</p></blockquote><li><b>Nhóm THOUGH:</b> chỉ sự tương phản</li><blockquote><p><strong>Ví dụ:</strong> Although I don’t agree with him, I think he’s honest.</p></blockquote><li><b>Nhóm IN ORDER THAT:</b> chỉ mục đích</li><blockquote><p><strong>Ví dụ:</strong> Send the letter express, so that they’ll get it before Tuesday.</p></blockquote></ul>	0
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
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, passwordhash, role, levelid, isactive, createdat, plan, plusexpiresat, avatarurl, onboardingcompleted, placementlevel, placementsource, placementcompletedat) FROM stdin;
00000000-0000-4000-8000-000000000001	admin_primary	admin.primary@system.com	$2a$10$ZHD.AVau1zRXJEdxx9yjyevkrSuCEbX4sZIcsnwbLv3E/nyyLm1Lm	admin	\N	t	2026-07-01 08:00:00+07	free	\N	\N	t	\N	\N	\N
00000000-0000-4000-8000-000000000101	hocvien_basic	hocvien.basic@example.com	$2a$10$NjUxCvtktULUTQI1SHpSU.nsft8BmFidioixYtLAOakB1djPdMa8u	user	1	t	2026-07-01 09:00:00+07	free	\N	\N	t	new	seed	2026-07-01 09:00:00+07
00000000-0000-4000-8000-000000000102	hocvien_intermediate	hocvien.intermediate@example.com	$2a$10$NjUxCvtktULUTQI1SHpSU.nsft8BmFidioixYtLAOakB1djPdMa8u	user	2	t	2026-07-01 09:05:00+07	free	\N	\N	t	basic	seed	2026-07-01 09:05:00+07
00000000-0000-4000-8000-000000000103	hocvien_advanced	hocvien.advanced@example.com	$2a$10$NjUxCvtktULUTQI1SHpSU.nsft8BmFidioixYtLAOakB1djPdMa8u	user	3	t	2026-07-01 09:10:00+07	free	\N	\N	t	basic	seed	2026-07-01 09:10:00+07
\.


--
-- Data for Name: userstats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.userstats (userid, exp, level, streakdays, lastlogin) FROM stdin;
00000000-0000-4000-8000-000000000001	0	1	0	2026-07-02 08:00:00
00000000-0000-4000-8000-000000000101	0	1	0	2026-07-02 09:00:00
00000000-0000-4000-8000-000000000102	0	1	0	2026-07-02 09:05:00
00000000-0000-4000-8000-000000000103	0	1	0	2026-07-02 09:10:00
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

SELECT pg_catalog.setval('public.grammarcategories_id_seq', 60, true);


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
--   hocvien.basic@example.com / User@123
--   hocvien.intermediate@example.com / User@123
--   hocvien.advanced@example.com / User@123

-- PostgreSQL database dump complete
--

\unrestrict IrQucG3dr8kyR5udjqo4BZcx4mEaPdHvgeRatHohFC15JaHtnPQqpIjQLYSjO5C
