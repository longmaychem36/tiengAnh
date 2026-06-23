--
-- PostgreSQL database dump
--

\restrict FnQ4TiPTh6JkIzbiQ2Q2lcdgbVQEQfGASLsoDWiSvKrhqDQrsn8fZUgIs6hJUxE

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
ALTER TABLE IF EXISTS ONLY public.writingexercises DROP CONSTRAINT IF EXISTS writingexercises_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.userweaknesses DROP CONSTRAINT IF EXISTS userweaknesses_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.userstats DROP CONSTRAINT IF EXISTS userstats_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_levelid_fkey;
ALTER TABLE IF EXISTS ONLY public.usergameprogress DROP CONSTRAINT IF EXISTS usergameprogress_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.usergameprogress DROP CONSTRAINT IF EXISTS usergameprogress_levelid_fkey;
ALTER TABLE IF EXISTS ONLY public.usererrorevents DROP CONSTRAINT IF EXISTS usererrorevents_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.usercollectionwords DROP CONSTRAINT IF EXISTS usercollectionwords_collectionid_fkey;
ALTER TABLE IF EXISTS ONLY public.usercollections DROP CONSTRAINT IF EXISTS usercollections_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.usercollections DROP CONSTRAINT IF EXISTS usercollections_reviewedby_fkey;
ALTER TABLE IF EXISTS ONLY public.userachievements DROP CONSTRAINT IF EXISTS userachievements_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.userachievements DROP CONSTRAINT IF EXISTS userachievements_achievementid_fkey;
ALTER TABLE IF EXISTS ONLY public.studytimedaily DROP CONSTRAINT IF EXISTS studytimedaily_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.speakingquestions DROP CONSTRAINT IF EXISTS speakingquestions_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.readingvocabulary DROP CONSTRAINT IF EXISTS readingvocabulary_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.readingquestions DROP CONSTRAINT IF EXISTS readingquestions_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.readingprogress DROP CONSTRAINT IF EXISTS readingprogress_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.readingparagraphs DROP CONSTRAINT IF EXISTS readingparagraphs_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.paymentrequests DROP CONSTRAINT IF EXISTS paymentrequests_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.minigamequestions DROP CONSTRAINT IF EXISTS minigamequestions_levelid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningvocabulary DROP CONSTRAINT IF EXISTS listeningvocabulary_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningspeakers DROP CONSTRAINT IF EXISTS listeningspeakers_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningsegments DROP CONSTRAINT IF EXISTS listeningsegments_speakerid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningsegments DROP CONSTRAINT IF EXISTS listeningsegments_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningquestions DROP CONSTRAINT IF EXISTS listeningquestions_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.listeningprogress DROP CONSTRAINT IF EXISTS listeningprogress_lessonid_fkey;
ALTER TABLE IF EXISTS ONLY public.grammartopics DROP CONSTRAINT IF EXISTS grammartopics_categoryid_fkey;
ALTER TABLE IF EXISTS ONLY public.grammarquiz DROP CONSTRAINT IF EXISTS grammarquiz_topicid_fkey;
ALTER TABLE IF EXISTS ONLY public.grammarprogress DROP CONSTRAINT IF EXISTS grammarprogress_topicid_fkey;
ALTER TABLE IF EXISTS ONLY public.dailytasks DROP CONSTRAINT IF EXISTS dailytasks_userid_fkey;
DROP INDEX IF EXISTS public.ux_usergameprogress_user_level;
DROP INDEX IF EXISTS public.uq_gamelevels_levelnumber;
DROP INDEX IF EXISTS public.uq_daily_tasks_user_date_order;
DROP INDEX IF EXISTS public.ix_minigamequestions_level_order;
DROP INDEX IF EXISTS public.idx_user_weaknesses_user_weight;
DROP INDEX IF EXISTS public.idx_user_error_events_user_skill;
DROP INDEX IF EXISTS public.idx_user_error_events_reference;
DROP INDEX IF EXISTS public.idx_user_email;
DROP INDEX IF EXISTS public.idx_user_collections_public_review;
DROP INDEX IF EXISTS public.idx_readingparagraphs_lesson;
DROP INDEX IF EXISTS public.idx_reading_vocab_lesson;
DROP INDEX IF EXISTS public.idx_reading_questions_lesson;
DROP INDEX IF EXISTS public.idx_reading_lessons_order;
DROP INDEX IF EXISTS public.idx_placement_minigame_active_type;
DROP INDEX IF EXISTS public.idx_payment_requests_transfer_content;
DROP INDEX IF EXISTS public.idx_payment_requests_sepay_transaction;
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
ALTER TABLE IF EXISTS ONLY public.userweaknesses DROP CONSTRAINT IF EXISTS userweaknesses_userid_skill_errortype_errorkey_key;
ALTER TABLE IF EXISTS ONLY public.userweaknesses DROP CONSTRAINT IF EXISTS userweaknesses_pkey;
ALTER TABLE IF EXISTS ONLY public.userstats DROP CONSTRAINT IF EXISTS userstats_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.usergameprogress DROP CONSTRAINT IF EXISTS usergameprogress_pkey;
ALTER TABLE IF EXISTS ONLY public.usererrorevents DROP CONSTRAINT IF EXISTS usererrorevents_pkey;
ALTER TABLE IF EXISTS ONLY public.usercollectionwords DROP CONSTRAINT IF EXISTS usercollectionwords_pkey;
ALTER TABLE IF EXISTS ONLY public.usercollections DROP CONSTRAINT IF EXISTS usercollections_pkey;
ALTER TABLE IF EXISTS ONLY public.userachievements DROP CONSTRAINT IF EXISTS userachievements_pkey;
ALTER TABLE IF EXISTS ONLY public.usergameprogress DROP CONSTRAINT IF EXISTS uq_ugp_user_level;
ALTER TABLE IF EXISTS ONLY public.studytimedaily DROP CONSTRAINT IF EXISTS studytimedaily_pkey;
ALTER TABLE IF EXISTS ONLY public.speakingquestions DROP CONSTRAINT IF EXISTS speakingquestions_pkey;
ALTER TABLE IF EXISTS ONLY public.speakingprogress DROP CONSTRAINT IF EXISTS speakingprogress_pkey;
ALTER TABLE IF EXISTS ONLY public.speakinglessons DROP CONSTRAINT IF EXISTS speakinglessons_pkey;
ALTER TABLE IF EXISTS ONLY public.readingvocabulary DROP CONSTRAINT IF EXISTS readingvocabulary_pkey;
ALTER TABLE IF EXISTS ONLY public.readingquestions DROP CONSTRAINT IF EXISTS readingquestions_pkey;
ALTER TABLE IF EXISTS ONLY public.readingprogress DROP CONSTRAINT IF EXISTS readingprogress_pkey;
ALTER TABLE IF EXISTS ONLY public.readingparagraphs DROP CONSTRAINT IF EXISTS readingparagraphs_pkey;
ALTER TABLE IF EXISTS ONLY public.readinglessons DROP CONSTRAINT IF EXISTS readinglessons_pkey;
ALTER TABLE IF EXISTS ONLY public.placementminigamequestions DROP CONSTRAINT IF EXISTS placementminigamequestions_pkey;
ALTER TABLE IF EXISTS ONLY public.paymentrequests DROP CONSTRAINT IF EXISTS paymentrequests_pkey;
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
ALTER TABLE IF EXISTS ONLY public.achievements DROP CONSTRAINT IF EXISTS achievements_pkey;
ALTER TABLE IF EXISTS public.learninglevels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.grammarcategories ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.writingvocab;
DROP TABLE IF EXISTS public.writingprogress;
DROP TABLE IF EXISTS public.writinglessons;
DROP TABLE IF EXISTS public.writingexercises;
DROP TABLE IF EXISTS public.userweaknesses;
DROP TABLE IF EXISTS public.userstats;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.usergameprogress;
DROP TABLE IF EXISTS public.usererrorevents;
DROP TABLE IF EXISTS public.usercollectionwords;
DROP TABLE IF EXISTS public.usercollections;
DROP TABLE IF EXISTS public.userachievements;
DROP TABLE IF EXISTS public.studytimedaily;
DROP TABLE IF EXISTS public.speakingquestions;
DROP TABLE IF EXISTS public.speakingprogress;
DROP TABLE IF EXISTS public.speakinglessons;
DROP TABLE IF EXISTS public.readingvocabulary;
DROP TABLE IF EXISTS public.readingquestions;
DROP TABLE IF EXISTS public.readingprogress;
DROP TABLE IF EXISTS public.readingparagraphs;
DROP TABLE IF EXISTS public.readinglessons;
DROP TABLE IF EXISTS public.placementminigamequestions;
DROP TABLE IF EXISTS public.paymentrequests;
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
DROP TABLE IF EXISTS public.achievements;
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
-- Name: achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100),
    description character varying(255),
    condition character varying(255)
);


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
    rewardexp integer DEFAULT 10 NOT NULL
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
-- Name: userachievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.userachievements (
    userid uuid NOT NULL,
    achievementid uuid NOT NULL,
    unlockedat timestamp without time zone DEFAULT now()
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
-- Name: usererrorevents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usererrorevents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid NOT NULL,
    skill character varying(40) NOT NULL,
    activitytype character varying(60) NOT NULL,
    referencetype character varying(60),
    referenceid character varying(120),
    errortype character varying(80) NOT NULL,
    errorkey character varying(140) NOT NULL,
    severity integer DEFAULT 3,
    prompt text,
    useranswer text,
    expectedanswer text,
    feedback text,
    metadata jsonb,
    createdat timestamp without time zone DEFAULT now() NOT NULL
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
    placementlevel character varying(20) DEFAULT 'basic'::character varying,
    placementsource character varying(30) DEFAULT 'legacy'::character varying,
    placementcompletedat timestamp with time zone DEFAULT now(),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying, 'superadmin'::character varying])::text[])))
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
-- Name: userweaknesses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.userweaknesses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid NOT NULL,
    skill character varying(40) NOT NULL,
    errortype character varying(80) NOT NULL,
    errorkey character varying(140) NOT NULL,
    label character varying(255) NOT NULL,
    mistakecount integer DEFAULT 0 NOT NULL,
    attemptcount integer DEFAULT 0 NOT NULL,
    weight double precision DEFAULT 0 NOT NULL,
    lastseenat timestamp without time zone DEFAULT now() NOT NULL,
    updatedat timestamp without time zone DEFAULT now() NOT NULL
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
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.achievements (id, name, description, condition) FROM stdin;
\.


--
-- Data for Name: dailytasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dailytasks (id, userid, taskdate, skill, targettype, targetid, title, description, reason, status, orderindex, airationale, completedat, createdat, rewardexp) FROM stdin;
5319e1ab-9988-4410-92d2-4a9118eeb94f	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-06-18	listening	listening_lesson	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Listening: Nghe chữ cái và đánh vần	Luyện nghe chủ đề Alphabet.	Luyện nghe một bài ngắn để làm nóng khả năng phản xạ.	pending	1	daily_plan	\N	2026-06-18 14:54:50.010382	20
551c04da-a4ae-4525-9742-cfb31c550ec5	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-06-18	speaking	speaking_lesson	dfee0411-e605-429d-9d10-72e817b57863	Speaking: Hỏi và trả lời tuổi	Nghe mẫu và luyện nói lại các câu trọng tâm.	Nói vài câu mẫu để giữ nhịp phát âm mỗi ngày.	pending	2	daily_plan	\N	2026-06-18 14:54:50.011749	25
a147952c-2164-4ded-97bf-154d5324c1fe	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-06-18	habit	daily_login	today	Đăng nhập hôm nay	Mở hệ thống học tập để giữ nhịp học mỗi ngày.	Nhiệm vụ khởi động nhanh, nhận EXP ngay khi hoàn thành.	completed	0	habit	2026-06-18 14:54:50.014676	2026-06-18 14:54:50.008376	10
0e14be84-5bac-498c-bf7a-f0356f9603a4	34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-18	listening	listening_lesson	3c3af2dc-5680-4906-a850-58560747cb9f	Listening: Màu sắc và đồ vật quen thuộc	Luyện nghe chủ đề Colors and objects.	Luyện nghe một bài ngắn để làm nóng khả năng phản xạ.	pending	1	daily_plan	\N	2026-06-18 18:58:06.439164	20
ac4b50b8-04b0-4f1b-ab4d-d7a37870a10d	34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-18	speaking	speaking_lesson	dfee0411-e605-429d-9d10-72e817b57863	Speaking: Hỏi và trả lời tuổi	Nghe mẫu và luyện nói lại các câu trọng tâm.	Nói vài câu mẫu để giữ nhịp phát âm mỗi ngày.	pending	2	daily_plan	\N	2026-06-18 18:58:06.441242	25
9fabbd43-46bf-488b-8755-72364e9d77d4	34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-18	habit	daily_login	today	Đăng nhập hôm nay	Mở hệ thống học tập để giữ nhịp học mỗi ngày.	Nhiệm vụ khởi động nhanh, nhận EXP ngay khi hoàn thành.	completed	0	habit	2026-06-18 18:58:06.447006	2026-06-18 18:58:06.330557	10
f71fdebf-65ea-4589-aaec-08f770d657f0	5a708101-a917-4e6f-bf93-0a960a638577	2026-06-19	listening	listening_lesson	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Listening: Nghe chữ cái và đánh vần	Luyện nghe chủ đề Alphabet.	Luyện nghe một bài ngắn để làm nóng khả năng phản xạ.	pending	1	daily_plan	\N	2026-06-19 08:30:06.591555	20
aec32111-aa9a-485d-9087-8242b2aaf331	5a708101-a917-4e6f-bf93-0a960a638577	2026-06-19	speaking	speaking_lesson	dfee0411-e605-429d-9d10-72e817b57863	Speaking: Hỏi và trả lời tuổi	Nghe mẫu và luyện nói lại các câu trọng tâm.	Nói vài câu mẫu để giữ nhịp phát âm mỗi ngày.	pending	2	daily_plan	\N	2026-06-19 08:30:06.592855	25
b27a2ef8-5a89-4dde-a292-bb8176aee00b	5a708101-a917-4e6f-bf93-0a960a638577	2026-06-19	habit	daily_login	today	Đăng nhập hôm nay	Mở hệ thống học tập để giữ nhịp học mỗi ngày.	Nhiệm vụ khởi động nhanh, nhận EXP ngay khi hoàn thành.	completed	0	habit	2026-06-19 08:30:06.595731	2026-06-19 08:30:06.586393	10
0559f7bb-682e-4a6d-8789-b929f5ab5a41	7e4ca808-477c-4cf1-84eb-8d59fa43c580	2026-06-20	listening	listening_lesson	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Listening: Nghe chữ cái và đánh vần	Luyện nghe chủ đề Alphabet.	Luyện nghe một bài ngắn để làm nóng khả năng phản xạ.	pending	1	daily_plan	\N	2026-06-20 15:35:40.574645	20
ec997ffd-dd98-46c8-84b6-e9298a9dfef9	7e4ca808-477c-4cf1-84eb-8d59fa43c580	2026-06-20	speaking	speaking_lesson	dfee0411-e605-429d-9d10-72e817b57863	Speaking: Hỏi và trả lời tuổi	Nghe mẫu và luyện nói lại các câu trọng tâm.	Nói vài câu mẫu để giữ nhịp phát âm mỗi ngày.	pending	2	daily_plan	\N	2026-06-20 15:35:40.576081	25
974c87bf-882a-4827-8b4f-b80c8897f905	7e4ca808-477c-4cf1-84eb-8d59fa43c580	2026-06-20	habit	daily_login	today	Đăng nhập hôm nay	Mở hệ thống học tập để giữ nhịp học mỗi ngày.	Nhiệm vụ khởi động nhanh, nhận EXP ngay khi hoàn thành.	completed	0	habit	2026-06-20 15:35:40.579363	2026-06-20 15:35:40.540859	10
b4d2ceef-e0b3-4eac-ac28-cf513028a085	0a70cf27-dd6e-4891-981f-a6fa185fdbed	2026-06-20	listening	listening_lesson	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Listening: Nghe chữ cái và đánh vần	Luyện nghe chủ đề Alphabet.	Luyện nghe một bài ngắn để làm nóng khả năng phản xạ.	pending	1	daily_plan	\N	2026-06-20 16:12:47.581011	20
5d09d8eb-acc0-494a-8b6c-c0e275fd3685	0a70cf27-dd6e-4891-981f-a6fa185fdbed	2026-06-20	speaking	speaking_lesson	dfee0411-e605-429d-9d10-72e817b57863	Speaking: Hỏi và trả lời tuổi	Nghe mẫu và luyện nói lại các câu trọng tâm.	Nói vài câu mẫu để giữ nhịp phát âm mỗi ngày.	pending	2	daily_plan	\N	2026-06-20 16:12:47.582887	25
d8b7eebc-7c3d-4c46-ae43-370f72fbcace	0a70cf27-dd6e-4891-981f-a6fa185fdbed	2026-06-20	habit	daily_login	today	Đăng nhập hôm nay	Mở hệ thống học tập để giữ nhịp học mỗi ngày.	Nhiệm vụ khởi động nhanh, nhận EXP ngay khi hoàn thành.	completed	0	habit	2026-06-20 16:12:47.585974	2026-06-20 16:12:47.574321	10
b638b063-9bec-4e85-9385-d9a1f4c339f4	7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-20	listening	listening_lesson	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Listening: Nghe chữ cái và đánh vần	Luyện nghe chủ đề Alphabet.	Luyện nghe một bài ngắn để làm nóng khả năng phản xạ.	pending	1	daily_plan	\N	2026-06-20 16:28:03.006702	20
3375c776-db85-40f6-8bb2-0ade3226646b	7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-20	speaking	speaking_lesson	dfee0411-e605-429d-9d10-72e817b57863	Speaking: Hỏi và trả lời tuổi	Nghe mẫu và luyện nói lại các câu trọng tâm.	Nói vài câu mẫu để giữ nhịp phát âm mỗi ngày.	pending	2	daily_plan	\N	2026-06-20 16:28:03.008289	25
9d42a844-1d98-449b-b85c-a03d08c52a2d	7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-20	habit	daily_login	today	Đăng nhập hôm nay	Mở hệ thống học tập để giữ nhịp học mỗi ngày.	Nhiệm vụ khởi động nhanh, nhận EXP ngay khi hoàn thành.	completed	0	habit	2026-06-20 16:28:03.01106	2026-06-20 16:28:03.004635	10
ee466b14-77a4-4569-9f86-5b781fcaa176	5d533fb3-8bab-4e32-8a70-2fd3d523e378	2026-06-22	listening	listening_lesson	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Listening: Nghe chữ cái và đánh vần	Luyện nghe chủ đề Alphabet.	Luyện nghe một bài ngắn để làm nóng khả năng phản xạ.	pending	1	daily_plan	\N	2026-06-22 10:08:59.319746	20
0624982f-a315-4a7b-8d9b-2afb46b653db	5d533fb3-8bab-4e32-8a70-2fd3d523e378	2026-06-22	speaking	speaking_lesson	dfee0411-e605-429d-9d10-72e817b57863	Speaking: Hỏi và trả lời tuổi	Nghe mẫu và luyện nói lại các câu trọng tâm.	Nói vài câu mẫu để giữ nhịp phát âm mỗi ngày.	pending	2	daily_plan	\N	2026-06-22 10:08:59.321152	25
740d90ac-782e-4897-a576-16cdb32c2bab	5d533fb3-8bab-4e32-8a70-2fd3d523e378	2026-06-22	habit	daily_login	today	Đăng nhập hôm nay	Mở hệ thống học tập để giữ nhịp học mỗi ngày.	Nhiệm vụ khởi động nhanh, nhận EXP ngay khi hoàn thành.	completed	0	habit	2026-06-22 10:08:59.324649	2026-06-22 10:08:59.285819	10
69a79297-861a-4b2c-845c-0772d9269750	5a708101-a917-4e6f-bf93-0a960a638577	2026-06-22	listening	listening_lesson	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Listening: Nghe chữ cái và đánh vần	Luyện nghe chủ đề Alphabet.	Luyện nghe một bài ngắn để làm nóng khả năng phản xạ.	pending	1	daily_plan	\N	2026-06-22 15:11:41.311401	20
79d685e1-8bc8-4c7d-afd8-abf69c513f07	5a708101-a917-4e6f-bf93-0a960a638577	2026-06-22	speaking	speaking_lesson	dfee0411-e605-429d-9d10-72e817b57863	Speaking: Hỏi và trả lời tuổi	Nghe mẫu và luyện nói lại các câu trọng tâm.	Nói vài câu mẫu để giữ nhịp phát âm mỗi ngày.	pending	2	daily_plan	\N	2026-06-22 15:11:41.312975	25
55c6a834-6a62-486e-92e7-df26887f5d42	5a708101-a917-4e6f-bf93-0a960a638577	2026-06-22	habit	daily_login	today	Đăng nhập hôm nay	Mở hệ thống học tập để giữ nhịp học mỗi ngày.	Nhiệm vụ khởi động nhanh, nhận EXP ngay khi hoàn thành.	completed	0	habit	2026-06-22 15:11:41.31543	2026-06-22 15:11:41.253317	10
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
7c142186-bdf1-4dd8-b174-5884468ae26a	8242916c-9535-4e55-893c-7d1338de5ea1	53	53	1	in_progress	2026-06-20 21:31:31.277824
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
6267aa83-f1b9-49ce-bdd3-f3df12db2568	Nghe chữ cái và đánh vần	Luyện nghe bảng chữ cái, cách đánh vần tên và từ ngắn.	A1	Alphabet	Nghe và nhận diện chữ cái tiếng Anh.	8 phút	\N	\N	-50	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:58.675+07	t
3c3af2dc-5680-4906-a850-58560747cb9f	Màu sắc và đồ vật quen thuộc	Nghe câu ngắn về màu sắc và đồ vật trong lớp học.	A1	Colors and objects	Nhận diện màu sắc và đồ vật qua câu ngắn.	8 phút	\N	\N	-49	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:58.773+07	t
eb79a03f-9018-410a-937a-6932047adb7d	Thời gian trong ngày	Luyện nghe giờ đơn giản và hoạt động trong ngày.	A1	Time	Nghe giờ và hoạt động thường ngày.	9 phút	\N	\N	-48	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:58.824+07	t
b01c88a4-3ad5-4f98-999b-553830aaf7e6	Chào hỏi và giới thiệu tên	Nghe các câu chào hỏi rất ngắn cho người mới bắt đầu.	A0	Greetings	Nghe các câu chào hỏi rất ngắn cho người mới bắt đầu.	5 phút	Chào hỏi và giới thiệu tên		-47	2026-06-12 09:39:58.830245+07	2026-06-12 09:40:11.58723+07	t
04ed6a9c-8a8d-4263-b462-b21554d286fe	Số và thông tin cá nhân	Nghe số tuổi, số điện thoại đơn giản và câu hỏi thông tin cá nhân.	A0	Personal information	Nghe số tuổi, số điện thoại đơn giản và câu hỏi thông tin cá nhân.	5 phút	Số và thông tin cá nhân		-46	2026-06-12 09:39:59.038052+07	2026-06-12 09:40:11.611951+07	t
bd620079-7933-41f4-a825-bbae50ab23c7	A Morning Routine	Nghe hội thoại ngắn về thói quen buổi sáng.	A1	Daily life	Nhận biết thời gian, hoạt động hằng ngày và ý chính của cuộc hội thoại.	8 phút		\N	1	2026-05-22 09:40:06.84333+07	2026-05-22 09:40:06.84333+07	f
20abb717-63e6-45d5-a22e-96636beedb50	Checking In At A Hotel	Nghe tình huống nhận phòng khách sạn.	A2	Travel	Bắt thông tin về đặt phòng, giấy tờ và thời gian trả phòng.	10 phút		\N	2	2026-05-22 09:40:06.990171+07	2026-05-22 09:40:06.990171+07	f
949f3df4-f7a3-4697-8005-22d7b9deaa73	Ordering Lunch	Listen to a short conversation at a lunch counter.	A1	Food	Understand simple food orders and prices.	10 phút	\N	\N	3	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:58.877+07	f
073560d6-69c3-4c98-9c63-cf724896c2b2	At The Bus Stop	Listen for route, time, and destination details.	A1	Transport	Catch simple travel information in a short dialogue.	11 phút	\N	\N	4	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:58.927+07	f
5f7512ec-0338-407b-973b-e383a6a91503	Making An Appointment	Understand a simple phone call about choosing a time.	A2	Appointments	Listen for day, time, and purpose.	12 phút	\N	\N	5	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:58.98+07	f
\.


--
-- Data for Name: listeningprogress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listeningprogress (userid, lessonid, status, score, updatedat) FROM stdin;
34e079cb-e041-4085-9a31-a0782fdd5af8	6267aa83-f1b9-49ce-bdd3-f3df12db2568	completed	100	2026-06-18 14:53:29.607292+07
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
6537a85d-3058-42a2-a436-654a397b3f54	bd620079-7933-41f4-a825-bbae50ab23c7	Ben	I usually wake up at six thirty. I catch the bus at seven fifteen.	1	5ccef698-e87c-4ea2-a9ae-71fcdc8da774
8b5c1cce-67ab-4dfe-a018-b6a79f3cc1de	bd620079-7933-41f4-a825-bbae50ab23c7	Anna	That is early. I wake up at seven and have breakfast at home.	2	486c650c-f2a5-4818-9e2d-f6095648482b
34f47f62-1e8a-4fa7-90ce-231cbde74c09	bd620079-7933-41f4-a825-bbae50ab23c7	Ben	What do you eat for breakfast?	3	5ccef698-e87c-4ea2-a9ae-71fcdc8da774
ab1ef11b-428f-47b6-9492-5835c0b81108	bd620079-7933-41f4-a825-bbae50ab23c7	Anna	I eat bread, drink coffee, and read the news for ten minutes.	4	486c650c-f2a5-4818-9e2d-f6095648482b
f1ff03e7-10d5-4ec6-9207-84e896293ea7	bd620079-7933-41f4-a825-bbae50ab23c7	Ben	That sounds calm. My mornings are always busy.	5	5ccef698-e87c-4ea2-a9ae-71fcdc8da774
e5651917-92fd-45b1-9b5d-188f6a773d1f	20abb717-63e6-45d5-a22e-96636beedb50	Receptionist	Good evening. Welcome to Green Lake Hotel. How can I help you?	0	e58de633-6dec-4bd6-936e-3e4ac2ba4edc
81917098-a9e1-403e-9fc0-b5dd2ea07310	20abb717-63e6-45d5-a22e-96636beedb50	Guest	Hello. I have a reservation under the name Nguyen.	1	8cd641ff-0b7e-4036-a2ef-3497657eace9
2912a7c6-49ba-498f-a69f-e12f3700065d	20abb717-63e6-45d5-a22e-96636beedb50	Receptionist	Let me check. Yes, one single room for two nights.	2	e58de633-6dec-4bd6-936e-3e4ac2ba4edc
c3114cc2-f40f-4c12-901b-f814a860b3fe	20abb717-63e6-45d5-a22e-96636beedb50	Guest	That is right. Do you need my passport?	3	8cd641ff-0b7e-4036-a2ef-3497657eace9
41c137d7-48d9-454b-9fa6-328d74370c7c	20abb717-63e6-45d5-a22e-96636beedb50	Receptionist	Yes, please. Here is your key card. Breakfast is from six thirty to nine.	4	e58de633-6dec-4bd6-936e-3e4ac2ba4edc
5d4ae71b-f552-4f88-9518-94a1df1e2ee5	20abb717-63e6-45d5-a22e-96636beedb50	Guest	Great. What time is check-out?	5	8cd641ff-0b7e-4036-a2ef-3497657eace9
8f49814f-ce33-45b5-94f4-bcf067d539a5	20abb717-63e6-45d5-a22e-96636beedb50	Receptionist	Check-out is at eleven in the morning.	6	e58de633-6dec-4bd6-936e-3e4ac2ba4edc
86739d41-73f5-4c15-bf9d-ea333473edba	bd620079-7933-41f4-a825-bbae50ab23c7	Anna	Hi Ben. What time do you wake up on weekdays?	0	486c650c-f2a5-4818-9e2d-f6095648482b
cb58cbcb-7f43-4ae1-a6bf-d0810dc87aa0	04ed6a9c-8a8d-4263-b462-b21554d286fe	Mai	How old are you?	1	\N
a8dfab80-1a65-4ce4-a13c-bbe468bea08a	04ed6a9c-8a8d-4263-b462-b21554d286fe	Tom	I am eighteen years old.	2	\N
a3798c5c-c1b6-485e-9c54-71570ee31f78	04ed6a9c-8a8d-4263-b462-b21554d286fe	Mai	What is your phone number?	3	\N
b4cf7bd2-930f-4d63-8956-2150dc3aa0b8	04ed6a9c-8a8d-4263-b462-b21554d286fe	Tom	It is one two three four.	4	\N
f3c10ed7-d6e7-4b9e-950d-6126ef270755	b01c88a4-3ad5-4f98-999b-553830aaf7e6	anna	Hello. My name is Anna.	1	e53a44a1-806c-48b7-8bf0-cbf280d388b8
183520fe-29a7-4f4f-b841-b1ef42ffe05b	b01c88a4-3ad5-4f98-999b-553830aaf7e6	ben	Hi Anna. I am Ben.	2	17279189-f681-4e59-8457-4e3f36f3e978
46d07099-c9f2-430a-bfb0-f14cadc42524	b01c88a4-3ad5-4f98-999b-553830aaf7e6	anna	Nice to meet you, Ben.	3	e53a44a1-806c-48b7-8bf0-cbf280d388b8
06b8d51c-5595-4788-b71f-6b5113024131	b01c88a4-3ad5-4f98-999b-553830aaf7e6	ben	Nice to meet you too.	4	17279189-f681-4e59-8457-4e3f36f3e978
dd04e0cd-d4c2-4f8f-a43a-39e67f6581b1	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Teacher	Listen and repeat the letters: A, B, C, D, E.	1	\N
4af6da85-c47e-4c49-a07f-087b1ad0c082	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Student	A, B, C, D, E.	2	\N
83cdc1a9-808e-4b3e-91bd-5308adfddb99	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Teacher	How do you spell your name?	3	\N
8870790f-5d8e-4850-9dd2-b8544cda7b61	6267aa83-f1b9-49ce-bdd3-f3df12db2568	Student	L-I-N-H. Linh.	4	\N
5b184c60-3e5c-44b8-8258-773f9728ddcf	3c3af2dc-5680-4906-a850-58560747cb9f	Teacher	This is a blue pen.	1	\N
866021ca-0998-4b61-bad5-b9357b023ae7	3c3af2dc-5680-4906-a850-58560747cb9f	Student	The pen is blue.	2	\N
c0b91413-6531-4b1f-942b-4c6eb26bcc8d	3c3af2dc-5680-4906-a850-58560747cb9f	Teacher	That is a red notebook.	3	\N
daa5bf97-5c24-4d70-9776-b1dcef2f4de4	3c3af2dc-5680-4906-a850-58560747cb9f	Student	The notebook is red.	4	\N
060fbb71-74e3-4935-aeb8-991954e7a099	eb79a03f-9018-410a-937a-6932047adb7d	Anna	I get up at six thirty.	1	\N
c0a95333-0864-4cb6-86de-4f7bb6aa7cea	eb79a03f-9018-410a-937a-6932047adb7d	Anna	I go to school at seven fifteen.	2	\N
1f533562-1c62-444e-85b5-adea359d59d6	eb79a03f-9018-410a-937a-6932047adb7d	Mark	I have dinner at seven o clock.	3	\N
cbdd6734-e63b-47d6-89ba-ad0f8ad92606	eb79a03f-9018-410a-937a-6932047adb7d	Mark	I go to bed at ten.	4	\N
6f3443e1-0f0c-4e3e-9901-a38d7e0c004c	949f3df4-f7a3-4697-8005-22d7b9deaa73	Cashier	Hello. What would you like for lunch?	1	\N
52eeb24a-286e-4a52-8700-084520ab4f98	949f3df4-f7a3-4697-8005-22d7b9deaa73	Customer	I would like a chicken sandwich and orange juice.	2	\N
0d4fb804-3a2c-46e5-b78d-cf13f9113ee8	949f3df4-f7a3-4697-8005-22d7b9deaa73	Cashier	Sure. That is six dollars.	3	\N
ce78ec4c-148d-46ff-a50e-beb303d352b3	949f3df4-f7a3-4697-8005-22d7b9deaa73	Customer	Here you are. Thank you.	4	\N
06b5963a-7fbd-45ad-8172-8bb09dbff26e	073560d6-69c3-4c98-9c63-cf724896c2b2	Traveler	Excuse me, does this bus go to the museum?	1	\N
da20ac6a-4b28-4a97-96cc-1fba13ba0a3d	073560d6-69c3-4c98-9c63-cf724896c2b2	Local	Yes, take bus number twelve.	2	\N
9e685ef6-f886-4dc1-a154-15b277b01c25	073560d6-69c3-4c98-9c63-cf724896c2b2	Traveler	When does it arrive?	3	\N
e54020f6-a673-4349-8499-06fe1676b74d	073560d6-69c3-4c98-9c63-cf724896c2b2	Local	It arrives in ten minutes.	4	\N
5279fb3a-42b8-4b70-ab3e-ff83c94a4102	5f7512ec-0338-407b-973b-e383a6a91503	Receptionist	Good morning. How can I help you?	1	\N
7c360a7f-7003-4888-be57-70f8039ada22	5f7512ec-0338-407b-973b-e383a6a91503	Caller	I need to make an appointment with Dr. Brown.	2	\N
30a14cd8-93a4-41b3-8df2-dc32d69e5265	5f7512ec-0338-407b-973b-e383a6a91503	Receptionist	Is Thursday at three o clock okay?	3	\N
66e41aa7-1a04-497a-8101-833b3effe618	5f7512ec-0338-407b-973b-e383a6a91503	Caller	Yes, Thursday at three is fine.	4	\N
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
-- Data for Name: paymentrequests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.paymentrequests (id, userid, plan, amount, status, transfercontent, createdat, completedat, gateway, sepaytransactionid, rawpayload) FROM stdin;
32414d05-1998-4a8c-b252-a5ea6db56b84	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	plus	2000	pending	PLUSF7BA7C84F07E	2026-05-13 10:41:44.875258	\N	sepay	\N	\N
5acf37bb-c16d-48e4-97d2-f2ac75d294ad	9d4376dd-f532-418c-ad64-5d4861c2271c	plus	2000	completed	SEVQRPLUS9D43765C4AB6	2026-05-13 11:01:14.199987	2026-05-13 11:03:48.45292	sepay	local-test-1778645028169	{"id": "local-test-1778645028169", "content": "Thanh toan SEVQRPLUS9D43765C4AB6", "transferType": "in", "transferAmount": 2000}
3d2e1ea1-82f2-43aa-9e3b-5c57dc3d434e	3caa9c2a-cbcf-4d47-8949-1a1e6a987926	plus	2000	completed	SEVQRPLUS3CAA9C987E0C	2026-05-13 11:44:55.206943	2026-05-13 11:52:17.654872	sepay	57704578	{"id": "57704578", "raw": {"id": "57704578", "code": null, "amount_in": "2000.00", "amount_out": "0.00", "accumulated": "404204.00", "sub_account": null, "account_number": "108871077057", "bank_account_id": "58889", "bank_brand_name": "VietinBank", "reference_number": "201O4-8945OXsbX", "transaction_date": "2026-05-13 11:45:20", "transaction_content": "129009005376-0984236568-SEVQRPLUS3CAA9C987E0C"}, "source": "sepay-api", "content": "129009005376-0984236568-SEVQRPLUS3CAA9C987E0C", "transferType": "in", "accountNumber": "108871077057", "transferAmount": 2000}
58e69c32-2c02-4830-a3e5-82d20507b681	e9a6c3ce-b579-4775-9b5b-70641dbb47cd	plus	2000	completed	SEVQRPLUSE9A6C3676B88	2026-05-13 11:52:45.058057	2026-05-13 11:53:10.509244	sepay	57706749	{"id": "57706749", "raw": {"id": "57706749", "code": null, "amount_in": "2000.00", "amount_out": "0.00", "accumulated": "406204.00", "sub_account": null, "account_number": "108871077057", "bank_account_id": "58889", "bank_brand_name": "VietinBank", "reference_number": "248vO-8945uPaAU", "transaction_date": "2026-05-13 11:53:11", "transaction_content": "129010276404-0984236568-SEVQRPLUSE9A6C3676B88"}, "source": "sepay-api", "content": "129010276404-0984236568-SEVQRPLUSE9A6C3676B88", "transferType": "in", "accountNumber": "108871077057", "transferAmount": 2000}
ddd73403-a34d-4453-aba1-287e5e887b4e	7c142186-bdf1-4dd8-b174-5884468ae26a	plus	2000	completed	SEVQRPLUS7C1421D74C12	2026-05-13 11:20:40.157445	2026-05-13 15:03:14.825296	sepay	57701627	{"id": "57701627", "raw": {"id": "57701627", "code": null, "amount_in": "2000.00", "amount_out": "0.00", "accumulated": "402204.00", "sub_account": null, "account_number": "108871077057", "bank_account_id": "58889", "bank_brand_name": "VietinBank", "reference_number": "1k4Qq-8944i6SAk", "transaction_date": "2026-05-13 11:34:53", "transaction_content": "129007524170-0984236568-SEVQRPLUS7C1421D74C12"}, "source": "sepay-api", "content": "129007524170-0984236568-SEVQRPLUS7C1421D74C12", "transferType": "in", "accountNumber": "108871077057", "transferAmount": 2000}
269861f5-4ee9-4dac-b7ad-a6e7ea788302	78079a64-de94-4d1d-8e32-e82c30d574b3	plus	2000	completed	SEVQRPLUS78079AFA71F9	2026-05-13 15:03:39.024465	2026-05-13 15:04:06.805062	sepay	57749309	{"id": "57749309", "raw": {"id": "57749309", "code": null, "amount_in": "2000.00", "amount_out": "0.00", "accumulated": "372204.00", "sub_account": null, "account_number": "108871077057", "bank_account_id": "58889", "bank_brand_name": "VietinBank", "reference_number": "249AI-894IPpNJO", "transaction_date": "2026-05-13 15:04:09", "transaction_content": "129030604318-0984236568-SEVQRPLUS78079AFA71F9"}, "source": "sepay-api", "content": "129030604318-0984236568-SEVQRPLUS78079AFA71F9", "transferType": "in", "accountNumber": "108871077057", "transferAmount": 2000}
eab155e7-95bb-418d-9e65-251c15f22652	4fbfad70-0d7e-4b0a-9836-97fa708177a0	plus	2000	completed	SEVQRPLUS4FBFADC94C60	2026-05-14 09:42:48.934775	2026-05-14 09:43:36.610023	sepay	57951774	{"id": "57951774", "raw": {"id": "57951774", "code": null, "amount_in": "2000.00", "amount_out": "0.00", "accumulated": "349204.00", "sub_account": null, "account_number": "108871077057", "bank_account_id": "58889", "bank_brand_name": "VietinBank", "reference_number": "504S2650MKEX6T9W", "transaction_date": "2026-05-14 09:43:39", "transaction_content": "CT DEN:613420162338 SEVQRPLUS4FBFADC94C60"}, "source": "sepay-api", "content": "CT DEN:613420162338 SEVQRPLUS4FBFADC94C60", "transferType": "in", "accountNumber": "108871077057", "transferAmount": 2000}
2d491f3f-91f0-4ac8-ac06-0302bbdaad0f	0b44b67d-63b3-4705-9464-c5f6b279866a	plus	2000	pending	SEVQRPLUS0B44B6E39DCB	2026-05-14 22:01:49.730652	\N	sepay	\N	\N
29bb1dfa-cc93-43f5-b156-05a881752b3e	34e079cb-e041-4085-9a31-a0782fdd5af8	plus	2000	completed	SEVQRPLUS34E07931361F	2026-05-18 15:19:48.543853	2026-05-18 15:20:15.299135	sepay	59199351	{"id": "59199351", "raw": {"id": "59199351", "code": null, "amount_in": "2000.00", "amount_out": "0.00", "accumulated": "701904.00", "sub_account": null, "account_number": "108871077057", "bank_account_id": "58889", "bank_brand_name": "VietinBank", "reference_number": "2FyCy-89Bv1DR0r", "transaction_date": "2026-05-18 15:20:16", "transaction_content": "129715721686-0984236568-SEVQRPLUS34E07931361F"}, "source": "sepay-api", "content": "129715721686-0984236568-SEVQRPLUS34E07931361F", "transferType": "in", "accountNumber": "108871077057", "transferAmount": 2000}
3f362a09-c012-4a51-af35-2ea9fa538ea0	34e079cb-e041-4085-9a31-a0782fdd5af8	plus	2000	pending	SEVQRPLUS34E07999AA57	2026-06-17 21:27:40.295213	\N	sepay	\N	\N
\.


--
-- Data for Name: placementminigamequestions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.placementminigamequestions (id, questiontype, contenten, contentvi, audiourl, imageurl, correctanswer, options, difficulty, pointratio, isactive, orderindex, createdat, updatedat) FROM stdin;
bb3aa135-3c7b-46df-93da-c9e7ded8ef8b	truefalse	A cat is an animal	Mèo là một con vật	\N	\N	true	\N	easy	1.00	t	10	2026-06-20 15:09:19.76666+07	2026-06-20 16:07:19.195851+07
f92728be-60ac-4df2-81de-e54596dc45ea	truefalse	The dog is black	Con chó màu trắng	\N	\N	false	\N	easy	1.00	t	11	2026-06-20 15:09:19.76852+07	2026-06-20 16:07:19.197628+07
b9723572-bc67-42ce-b730-90a8974e11f3	truefalse	He has lived here for three years	Anh ấy đã sống ở đây được ba năm	\N	\N	true	\N	hard	1.50	t	12	2026-06-20 15:09:19.770557+07	2026-06-20 16:07:19.199378+07
71fc1ab5-f909-46d8-91fe-13e4adb02b65	speakrepeat	I can help you	Tôi có thể giúp bạn	\N	\N	I can help you	{"passScore": 70}	easy	1.00	t	13	2026-06-20 15:09:19.772605+07	2026-06-20 16:07:19.200908+07
43a73a09-39b6-43f8-9f51-69204c11f9b6	matching	apple	quả táo	\N	\N	quả táo	["quả táo", "quả chuối", "quyển sách"]	easy	1.00	t	1	2026-06-20 15:09:19.739053+07	2026-06-20 16:07:19.179311+07
ee9b2f2e-6609-4b87-8813-3e64a0babd8b	matching	train	tàu hỏa	\N	\N	tàu hỏa	["xe đạp", "tàu hỏa", "máy bay"]	easy	1.00	t	2	2026-06-20 15:09:19.749508+07	2026-06-20 16:07:19.181331+07
1dcb9d1b-99e7-4dbf-ba55-e960100d0787	matching	responsibility	trách nhiệm	\N	\N	trách nhiệm	["sự thuận tiện", "trách nhiệm", "lời mời"]	hard	1.50	t	3	2026-06-20 15:09:19.751638+07	2026-06-20 16:07:19.183081+07
0b719a6e-de4a-4a7e-94e4-9a753545b424	listening	Good morning	Chào buổi sáng	\N	\N	Good morning	["Good morning", "Good night", "Good evening"]	easy	1.00	t	4	2026-06-20 15:09:19.75407+07	2026-06-20 16:07:19.184756+07
cad61b5d-b7e5-433a-a887-37c903ca4990	listening	I like milk	Tôi thích sữa	\N	\N	I like milk	["I like milk", "I like tea", "I need milk"]	easy	1.00	t	5	2026-06-20 15:09:19.756217+07	2026-06-20 16:07:19.186872+07
c8d053ad-34d8-4a04-aa2f-3464a631427f	listening	Could you repeat that more slowly?	Bạn có thể nhắc lại chậm hơn không?	\N	\N	Could you repeat that more slowly?	["Could you repeat that more slowly?", "Could you read that more loudly?", "Could you write that down for me?"]	hard	1.50	t	6	2026-06-20 15:09:19.758216+07	2026-06-20 16:07:19.188805+07
879032b3-4411-4c9c-bbd0-b1f7f137f3a0	speakrepeat	Open the door please	Vui lòng mở cửa	\N	\N	Open the door please	{"passScore": 70}	easy	1.00	t	14	2026-06-20 15:09:19.774587+07	2026-06-20 16:07:19.202807+07
5e29017f-e4e3-4a0f-9095-5ca313ce8e9c	speakrepeat	The weather changed quickly after lunch	Thời tiết thay đổi nhanh sau bữa trưa	\N	\N	The weather changed quickly after lunch	{"passScore": 75}	hard	1.50	t	15	2026-06-20 15:09:19.776515+07	2026-06-20 16:07:19.204703+07
58007f9f-8f86-42b0-aa2e-164ae77c05de	listenbuild	I am a student	Tôi là học sinh	\N	\N	I am a student	["I", "am", "a", "student"]	easy	1.00	t	7	2026-06-20 15:09:19.76033+07	2026-06-20 16:13:41.983208+07
f288aeba-bba6-4f73-b83c-f42548e2482e	listenbuild	We go to school	Chúng tôi đi học	\N	\N	We go to school	["We", "go", "to", "school"]	easy	1.00	t	8	2026-06-20 15:09:19.762362+07	2026-06-20 16:13:53.99482+07
0b5165ce-97c0-4105-8c69-d131b6df1526	listenbuild	She usually takes the bus to work	Cô ấy thường đi xe buýt đến chỗ làm	\N	\N	She usually takes the bus to work	["She", "usually", "takes", "the", "bus", "to", "work"]	hard	1.50	t	9	2026-06-20 15:09:19.76438+07	2026-06-20 16:14:09.532046+07
\.


--
-- Data for Name: readinglessons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.readinglessons (id, title, description, level, topic, objective, duration, passagetitle, audiourl, orderindex, createdat, updatedat, isfoundation) FROM stdin;
671cda22-546d-4aee-a195-ec5068c0fc48	A Small Family	Đọc đoạn ngắn về các thành viên trong gia đình.	A1	Family	Nhận biết từ vựng gia đình và thông tin cơ bản.	8 phút	My Family	\N	-50	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:59.058+07	t
1b1e767c-01e8-470c-a9f3-124b116cfe78	My School Bag	Đọc đoạn ngắn về đồ vật trong cặp sách.	A1	School objects	Hiểu câu mô tả đồ vật quen thuộc.	8 phút	In My Bag	\N	-49	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:59.112+07	t
f052f18c-d46d-4c5a-ac03-6ddefbdbad07	The Weather Today	Đọc bản tin thời tiết rất ngắn.	A1	Weather	Hiểu từ vựng thời tiết và lời khuyên đơn giản.	9 phút	Sunny Morning	\N	-48	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:59.16+07	t
2a33464f-ee6a-49e3-bd92-b1de168fe9ed	My Name Is Linh	Đọc đoạn giới thiệu bản thân rất ngắn.	A0	Self introduction	Đọc đoạn giới thiệu bản thân rất ngắn.	5 phút	A Short Introduction		-47	2026-06-12 09:39:59.0561+07	2026-06-12 10:14:13.99879+07	t
ef44c251-5fbc-48a0-9570-9e492f6d695c	Things In My Classroom	Đọc tên đồ vật quen thuộc trong lớp học.	A0	Classroom	Đọc tên đồ vật quen thuộc trong lớp học.	5 phút	My Classroom		-46	2026-06-12 09:39:59.098622+07	2026-06-12 10:14:14.000089+07	t
873d0162-3e45-4a54-9b86-5bddd9cc54f4	A Healthy Breakfast	Đọc đoạn văn ngắn về bữa sáng lành mạnh.	A1	Health	Hiểu ý chính, nhận biết thực phẩm và thói quen đơn giản.	7 phút	Why Breakfast Matters		1	2026-05-22 09:40:07.008941+07	2026-06-12 10:14:14.00114+07	f
357c7c32-c4e6-43e5-8280-8d377a6f94c8	A Weekend Market	Read about a local market and answer detail questions.	A1	Shopping	Understand prices, items, and simple preferences.	10 phút	Saturday Market	\N	2	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:59.212+07	f
4e681afa-0983-4586-bad2-0f7e55d8dfc8	A New Neighbor	Read a short story about meeting a neighbor.	A2	Community	Identify people, actions, and feelings in a story.	11 phút	Next Door	\N	3	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:59.262+07	f
c32c90c8-1907-40de-b87b-1e55d70cb505	The City Library	Đọc thông báo về thư viện thành phố.	A2	Community	Tìm thông tin về giờ mở cửa, dịch vụ và quy định.	9 phút	New Services At The City Library		4	2026-05-22 09:40:07.029239+07	2026-06-12 10:14:14.003507+07	f
5c39d961-4038-4326-8204-3790aa5689f2	Saving Water At Home	Read a practical text about saving water.	A2	Environment	Understand advice and reasons in a simple article.	12 phút	Use Less Water	\N	5	2026-06-18 14:30:58.633595+07	2026-06-18 14:30:59.318+07	f
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
-- Data for Name: speakinglessons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.speakinglessons (id, title, description, orderindex, createdat, isfoundation) FROM stdin;
dfee0411-e605-429d-9d10-72e817b57863	Hỏi và trả lời tuổi	Luyện nói câu hỏi tuổi và câu trả lời ngắn.	-50	2026-06-18 14:30:58.633595	t
c50957d1-91e7-400e-b72a-57ae7eb05df3	Nói về đồ vật trong lớp	Luyện trả lời đồ vật và màu sắc đơn giản.	-49	2026-06-18 14:30:58.633595	t
fdff66ff-ad4b-40c6-990c-162e5cc7b575	Hỏi giờ đơn giản	Luyện nói giờ và hoạt động trong ngày.	-48	2026-06-18 14:30:58.633595	t
f089e61e-2174-4e93-aecd-409dab19038b	Chào hỏi cơ bản	Tập nói các câu chào hỏi ngắn và rõ.	-47	2026-06-12 09:39:59.112021	t
f9f85101-9879-42e0-be0f-f51d900291f8	Thông tin cá nhân	Tập trả lời tên, tuổi và nơi sống.	-46	2026-06-12 09:39:59.141162	t
f7c7bb21-bfad-4d5f-9057-aa493a6a2116	Chào hỏi cơ bản	Các mẫu câu chào hỏi hàng ngày	1	2026-05-11 11:31:32.770487	f
d3c02bda-d397-43f2-8b34-305067ac0b6d	Giới thiệu bản thân	Nói về bản thân và gia đình	2	2026-05-11 11:31:32.785334	f
b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	Tại nhà hàng	Giao tiếp khi đi ăn uống	3	2026-05-11 11:31:32.793291	f
eb5ed411-41ff-4422-bae2-1b551e4cc00e	Hỏi đường	Hỏi và chỉ đường đi	4	2026-05-11 11:31:32.799688	f
401e2660-0deb-41d5-a1d4-21e546fdff31	Mua sắm	Giao tiếp khi đi mua hàng	5	2026-05-11 11:31:32.806681	f
\.


--
-- Data for Name: speakingprogress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.speakingprogress (userid, lessonid, status, score, updatedat) FROM stdin;
e87b1064-01b8-4369-a98f-4c16da9c91fe	dfee0411-e605-429d-9d10-72e817b57863	completed	100	2026-06-18 15:04:12.111091
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
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-11	592	2026-06-11 21:12:22.720462
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-06-02	6480	2026-06-11 09:48:54.650343
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-06-04	6840	2026-06-11 09:48:54.652962
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-06-06	6120	2026-06-11 09:48:54.654455
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-06-08	6480	2026-06-11 09:48:54.655828
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-06-10	6840	2026-06-11 09:48:54.657163
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-05-01	4980	2026-06-11 09:48:54.658519
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-05-07	4980	2026-06-11 09:48:54.659981
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-05-13	4980	2026-06-11 09:48:54.661149
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-05-19	4980	2026-06-11 09:48:54.662327
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-05-25	4980	2026-06-11 09:48:54.663484
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-05-31	4980	2026-06-11 09:48:54.664682
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-04-04	4740	2026-06-11 09:48:54.6659
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-04-10	4740	2026-06-11 09:48:54.667183
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-04-16	4740	2026-06-11 09:48:54.668327
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-04-22	4740	2026-06-11 09:48:54.669385
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-04-28	4740	2026-06-11 09:48:54.670377
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-03-01	4500	2026-06-11 09:48:54.67138
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-03-07	4500	2026-06-11 09:48:54.672422
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-03-13	4500	2026-06-11 09:48:54.673487
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-03-19	4500	2026-06-11 09:48:54.674513
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-03-25	4500	2026-06-11 09:48:54.675514
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-03-31	4500	2026-06-11 09:48:54.676494
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-02-04	5340	2026-06-11 09:48:54.677468
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-02-10	5340	2026-06-11 09:48:54.678494
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-02-16	5340	2026-06-11 09:48:54.679728
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-02-22	5340	2026-06-11 09:48:54.681017
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-02-28	5340	2026-06-11 09:48:54.682567
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-01-01	5100	2026-06-11 09:48:54.683884
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-01-07	5100	2026-06-11 09:48:54.685184
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-01-13	5100	2026-06-11 09:48:54.686318
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-01-19	5100	2026-06-11 09:48:54.687345
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-01-25	5100	2026-06-11 09:48:54.688423
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-01-31	5100	2026-06-11 09:48:54.689477
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-12-04	4860	2026-06-11 09:48:54.690516
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-12-10	4860	2026-06-11 09:48:54.691816
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-12-16	4860	2026-06-11 09:48:54.69289
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-12-22	4860	2026-06-11 09:48:54.693933
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-12-28	4860	2026-06-11 09:48:54.695025
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-11-01	4620	2026-06-11 09:48:54.696052
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-11-07	4620	2026-06-11 09:48:54.697034
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-11-13	4620	2026-06-11 09:48:54.698042
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-11-19	4620	2026-06-11 09:48:54.699016
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-11-25	4620	2026-06-11 09:48:54.699981
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-10-04	5460	2026-06-11 09:48:54.70105
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-10-10	5460	2026-06-11 09:48:54.70209
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-10-16	5460	2026-06-11 09:48:54.703071
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-10-22	5460	2026-06-11 09:48:54.70397
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-10-28	5460	2026-06-11 09:48:54.704899
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-09-01	5220	2026-06-11 09:48:54.705828
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-09-07	5220	2026-06-11 09:48:54.706754
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-09-13	5220	2026-06-11 09:48:54.707671
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-09-19	5220	2026-06-11 09:48:54.708659
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-09-25	5220	2026-06-11 09:48:54.709578
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-08-04	4980	2026-06-11 09:48:54.710615
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-08-10	4980	2026-06-11 09:48:54.711678
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-08-16	4980	2026-06-11 09:48:54.712643
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-08-22	4980	2026-06-11 09:48:54.713636
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-08-28	4980	2026-06-11 09:48:54.714737
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-07-01	4740	2026-06-11 09:48:54.715889
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-07-07	4740	2026-06-11 09:48:54.716899
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-07-13	4740	2026-06-11 09:48:54.717837
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-07-19	4740	2026-06-11 09:48:54.71871
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-07-25	4740	2026-06-11 09:48:54.719624
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2025-07-31	4740	2026-06-11 09:48:54.720671
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-06-01	5760	2026-06-11 09:48:54.722516
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-06-02	6000	2026-06-11 09:48:54.723474
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-06-04	6480	2026-06-11 09:48:54.724345
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-06-05	5640	2026-06-11 09:48:54.725429
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-06-07	6120	2026-06-11 09:48:54.726642
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-06-08	6360	2026-06-11 09:48:54.727922
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-06-10	5760	2026-06-11 09:48:54.729237
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-06-11	6000	2026-06-11 09:48:54.730469
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-05-01	4620	2026-06-11 09:48:54.73161
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-05-04	4260	2026-06-11 09:48:54.733005
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-05-07	4980	2026-06-11 09:48:54.734143
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-05-10	4620	2026-06-11 09:48:54.735323
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-05-13	4260	2026-06-11 09:48:54.736395
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-05-16	4980	2026-06-11 09:48:54.737629
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-05-19	4620	2026-06-11 09:48:54.738793
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-05-22	4260	2026-06-11 09:48:54.73999
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-05-25	4980	2026-06-11 09:48:54.741223
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-05-28	4620	2026-06-11 09:48:54.742493
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-05-31	4260	2026-06-11 09:48:54.743799
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-03-01	4140	2026-06-11 09:48:54.744868
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-03-04	4860	2026-06-11 09:48:54.745913
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-03-07	4500	2026-06-11 09:48:54.747125
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-03-10	4140	2026-06-11 09:48:54.74838
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-03-13	4860	2026-06-11 09:48:54.749504
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-03-16	4500	2026-06-11 09:48:54.75059
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-03-19	4140	2026-06-11 09:48:54.751714
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-03-22	4860	2026-06-11 09:48:54.752795
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-03-25	4500	2026-06-11 09:48:54.753859
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-03-28	4140	2026-06-11 09:48:54.754971
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-03-31	4860	2026-06-11 09:48:54.7562
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-02-01	4440	2026-06-11 09:48:54.757492
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-02-04	4080	2026-06-11 09:48:54.758682
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-02-07	4800	2026-06-11 09:48:54.760183
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-02-10	4440	2026-06-11 09:48:54.761464
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-02-13	4080	2026-06-11 09:48:54.762587
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-02-16	4800	2026-06-11 09:48:54.763856
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-02-19	4440	2026-06-11 09:48:54.765329
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-02-22	4080	2026-06-11 09:48:54.766596
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-02-25	4800	2026-06-11 09:48:54.767784
22227f57-0aa9-4da0-b6ac-cfd00110b514	2026-02-28	4440	2026-06-11 09:48:54.768901
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-12-01	5040	2026-06-11 09:48:54.769991
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-12-04	4680	2026-06-11 09:48:54.771031
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-12-07	4320	2026-06-11 09:48:54.772206
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-12-10	5040	2026-06-11 09:48:54.77348
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-12-13	4680	2026-06-11 09:48:54.774596
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-12-16	4320	2026-06-11 09:48:54.775751
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-12-19	5040	2026-06-11 09:48:54.776936
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-12-22	4680	2026-06-11 09:48:54.777963
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-12-25	4320	2026-06-11 09:48:54.779013
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-12-28	5040	2026-06-11 09:48:54.780014
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-12-31	4680	2026-06-11 09:48:54.780983
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-11-01	4260	2026-06-11 09:48:54.78194
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-11-04	4980	2026-06-11 09:48:54.782898
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-11-07	4620	2026-06-11 09:48:54.783944
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-11-10	4260	2026-06-11 09:48:54.7851
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-11-13	4980	2026-06-11 09:48:54.786034
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-11-16	4620	2026-06-11 09:48:54.787016
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-11-19	4260	2026-06-11 09:48:54.788466
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-11-22	4980	2026-06-11 09:48:54.789982
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-11-25	4620	2026-06-11 09:48:54.791265
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-11-28	4260	2026-06-11 09:48:54.792509
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-09-01	4860	2026-06-11 09:48:54.793642
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-09-04	4500	2026-06-11 09:48:54.794669
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-09-07	4140	2026-06-11 09:48:54.796789
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-09-10	4860	2026-06-11 09:48:54.798022
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-09-13	4500	2026-06-11 09:48:54.799336
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-09-16	4140	2026-06-11 09:48:54.800581
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-09-19	4860	2026-06-11 09:48:54.801953
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-09-22	4500	2026-06-11 09:48:54.802996
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-09-25	4140	2026-06-11 09:48:54.804029
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-09-28	4860	2026-06-11 09:48:54.805114
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-08-01	4080	2026-06-11 09:48:54.80626
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-08-04	4800	2026-06-11 09:48:54.807423
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-08-07	4440	2026-06-11 09:48:54.808453
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-08-10	4080	2026-06-11 09:48:54.809459
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-08-13	4800	2026-06-11 09:48:54.810427
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-08-16	4440	2026-06-11 09:48:54.811475
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-08-19	4080	2026-06-11 09:48:54.812657
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-08-22	4800	2026-06-11 09:48:54.813696
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-08-25	4440	2026-06-11 09:48:54.814595
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-08-28	4080	2026-06-11 09:48:54.815475
22227f57-0aa9-4da0-b6ac-cfd00110b514	2025-08-31	4800	2026-06-11 09:48:54.816376
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-06-01	5220	2026-06-11 09:48:54.818228
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-06-03	5820	2026-06-11 09:48:54.819091
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-06-04	5040	2026-06-11 09:48:54.819905
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-06-06	5640	2026-06-11 09:48:54.820767
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-06-07	5940	2026-06-11 09:48:54.821621
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-06-09	5460	2026-06-11 09:48:54.822479
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-06-10	5760	2026-06-11 09:48:54.823328
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-04-01	4560	2026-06-11 09:48:54.824235
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-04-04	4380	2026-06-11 09:48:54.825109
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-04-07	4200	2026-06-11 09:48:54.82625
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-04-10	4020	2026-06-11 09:48:54.827424
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-04-13	3840	2026-06-11 09:48:54.828738
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-04-16	3660	2026-06-11 09:48:54.829949
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-04-19	4560	2026-06-11 09:48:54.831109
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-04-22	4380	2026-06-11 09:48:54.832271
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-04-25	4200	2026-06-11 09:48:54.8335
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-04-28	4020	2026-06-11 09:48:54.83467
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-03-01	3780	2026-06-11 09:48:54.835848
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-03-04	4680	2026-06-11 09:48:54.837125
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-03-07	4500	2026-06-11 09:48:54.838538
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-03-10	4320	2026-06-11 09:48:54.839761
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-03-13	4140	2026-06-11 09:48:54.840927
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-03-16	3960	2026-06-11 09:48:54.842115
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-03-19	3780	2026-06-11 09:48:54.84324
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-03-22	4680	2026-06-11 09:48:54.844375
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-03-25	4500	2026-06-11 09:48:54.845533
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-03-28	4320	2026-06-11 09:48:54.846662
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-03-31	4140	2026-06-11 09:48:54.8478
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-01-01	4380	2026-06-11 09:48:54.848955
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-01-04	4200	2026-06-11 09:48:54.850111
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-01-07	4020	2026-06-11 09:48:54.851242
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-01-10	3840	2026-06-11 09:48:54.852426
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-01-13	3660	2026-06-11 09:48:54.853628
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-01-16	4560	2026-06-11 09:48:54.854914
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-01-19	4380	2026-06-11 09:48:54.856126
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-01-22	4200	2026-06-11 09:48:54.857273
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-01-25	4020	2026-06-11 09:48:54.858432
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-01-28	3840	2026-06-11 09:48:54.85961
9d4376dd-f532-418c-ad64-5d4861c2271c	2026-01-31	3660	2026-06-11 09:48:54.860837
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-12-01	4680	2026-06-11 09:48:54.862013
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-12-04	4500	2026-06-11 09:48:54.863167
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-12-07	4320	2026-06-11 09:48:54.864335
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-12-10	4140	2026-06-11 09:48:54.865533
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-12-13	3960	2026-06-11 09:48:54.866716
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-12-16	3780	2026-06-11 09:48:54.868137
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-12-19	4680	2026-06-11 09:48:54.869319
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-12-22	4500	2026-06-11 09:48:54.870467
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-12-25	4320	2026-06-11 09:48:54.871629
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-12-28	4140	2026-06-11 09:48:54.872799
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-12-31	3960	2026-06-11 09:48:54.873955
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-10-01	4200	2026-06-11 09:48:54.875114
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-10-04	4020	2026-06-11 09:48:54.876326
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-10-07	3840	2026-06-11 09:48:54.877585
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-10-10	3660	2026-06-11 09:48:54.878862
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-10-13	4560	2026-06-11 09:48:54.879988
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-10-16	4380	2026-06-11 09:48:54.881169
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-10-19	4200	2026-06-11 09:48:54.882432
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-10-22	4020	2026-06-11 09:48:54.883587
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-10-25	3840	2026-06-11 09:48:54.884764
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-10-28	3660	2026-06-11 09:48:54.885949
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-10-31	4560	2026-06-11 09:48:54.88708
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-09-01	4500	2026-06-11 09:48:54.888185
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-09-04	4320	2026-06-11 09:48:54.889374
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-09-07	4140	2026-06-11 09:48:54.890408
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-09-10	3960	2026-06-11 09:48:54.89149
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-09-13	3780	2026-06-11 09:48:54.892631
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-09-16	4680	2026-06-11 09:48:54.893735
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-09-19	4500	2026-06-11 09:48:54.894866
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-09-22	4320	2026-06-11 09:48:54.895944
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-09-25	4140	2026-06-11 09:48:54.897053
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-09-28	3960	2026-06-11 09:48:54.898049
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-07-01	4020	2026-06-11 09:48:54.899075
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-07-04	3840	2026-06-11 09:48:54.900064
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-07-07	3660	2026-06-11 09:48:54.901156
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-07-10	4560	2026-06-11 09:48:54.902261
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-07-13	4380	2026-06-11 09:48:54.903407
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-07-16	4200	2026-06-11 09:48:54.90439
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-07-19	4020	2026-06-11 09:48:54.905407
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-07-22	3840	2026-06-11 09:48:54.906469
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-07-25	3660	2026-06-11 09:48:54.907521
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-07-28	4560	2026-06-11 09:48:55.005594
9d4376dd-f532-418c-ad64-5d4861c2271c	2025-07-31	4380	2026-06-11 09:48:55.006508
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-01	4680	2026-06-11 09:48:55.008305
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-03	4320	2026-06-11 09:48:55.009217
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-04	4680	2026-06-11 09:48:55.010104
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-05	5040	2026-06-11 09:48:55.012704
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-07	4680	2026-06-11 09:48:55.013596
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-08	5040	2026-06-11 09:48:55.014481
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-09	4320	2026-06-11 09:48:55.015342
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-11	5040	2026-06-11 09:48:55.016211
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-05-04	3900	2026-06-11 09:48:55.017095
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-05-07	3900	2026-06-11 09:48:55.018183
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-05-10	3900	2026-06-11 09:48:55.019293
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-05-16	3900	2026-06-11 09:48:55.020338
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-05-19	3900	2026-06-11 09:48:55.021336
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-05-22	3900	2026-06-11 09:48:55.022245
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-05-28	3900	2026-06-11 09:48:55.023119
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-05-31	3900	2026-06-11 09:48:55.023989
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-04-01	4200	2026-06-11 09:48:55.024867
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-04-07	4200	2026-06-11 09:48:55.025778
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-04-10	4200	2026-06-11 09:48:55.026762
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-04-13	4200	2026-06-11 09:48:55.028286
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-04-19	4200	2026-06-11 09:48:55.029595
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-04-22	4200	2026-06-11 09:48:55.031042
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-04-25	4200	2026-06-11 09:48:55.032612
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-03-01	3420	2026-06-11 09:48:55.033696
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-03-04	3420	2026-06-11 09:48:55.034607
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-03-10	3420	2026-06-11 09:48:55.03546
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-03-13	3420	2026-06-11 09:48:55.036315
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-03-16	3420	2026-06-11 09:48:55.037154
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-03-22	3420	2026-06-11 09:48:55.037993
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-03-25	3420	2026-06-11 09:48:55.038834
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-03-28	3420	2026-06-11 09:48:55.039673
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-02-01	3720	2026-06-11 09:48:55.040516
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-02-04	3720	2026-06-11 09:48:55.041385
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-02-07	3720	2026-06-11 09:48:55.042236
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-02-13	3720	2026-06-11 09:48:55.043081
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-02-16	3720	2026-06-11 09:48:55.044019
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-02-19	3720	2026-06-11 09:48:55.044867
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-02-25	3720	2026-06-11 09:48:55.045717
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-02-28	3720	2026-06-11 09:48:55.046562
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-01-04	4020	2026-06-11 09:48:55.047437
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-01-07	4020	2026-06-11 09:48:55.04829
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-01-10	4020	2026-06-11 09:48:55.049259
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-01-16	4020	2026-06-11 09:48:55.050162
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-01-19	4020	2026-06-11 09:48:55.051033
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-01-22	4020	2026-06-11 09:48:55.051879
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-01-28	4020	2026-06-11 09:48:55.052744
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-01-31	4020	2026-06-11 09:48:55.053621
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-12-01	3240	2026-06-11 09:48:55.05454
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-12-07	3240	2026-06-11 09:48:55.055428
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-12-10	3240	2026-06-11 09:48:55.056268
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-12-13	3240	2026-06-11 09:48:55.057129
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-12-19	3240	2026-06-11 09:48:55.058007
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-12-22	3240	2026-06-11 09:48:55.058855
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-12-25	3240	2026-06-11 09:48:55.059755
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-12-31	3240	2026-06-11 09:48:55.060797
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-11-01	3540	2026-06-11 09:48:55.061672
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-11-04	3540	2026-06-11 09:48:55.06254
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-11-10	3540	2026-06-11 09:48:55.063389
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-11-13	3540	2026-06-11 09:48:55.06424
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-11-16	3540	2026-06-11 09:48:55.065167
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-11-22	3540	2026-06-11 09:48:55.06614
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-11-25	3540	2026-06-11 09:48:55.066976
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-11-28	3540	2026-06-11 09:48:55.067762
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-10-01	3840	2026-06-11 09:48:55.068537
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-10-04	3840	2026-06-11 09:48:55.069316
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-10-07	3840	2026-06-11 09:48:55.070157
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-10-13	3840	2026-06-11 09:48:55.070935
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-10-16	3840	2026-06-11 09:48:55.071717
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-10-19	3840	2026-06-11 09:48:55.072499
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-10-25	3840	2026-06-11 09:48:55.073321
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-10-28	3840	2026-06-11 09:48:55.074087
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-10-31	3840	2026-06-11 09:48:55.074869
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-09-04	4140	2026-06-11 09:48:55.075657
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-09-07	4140	2026-06-11 09:48:55.076415
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-09-10	4140	2026-06-11 09:48:55.077238
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-09-16	4140	2026-06-11 09:48:55.078018
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-09-19	4140	2026-06-11 09:48:55.078801
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-09-22	4140	2026-06-11 09:48:55.079594
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-09-28	4140	2026-06-11 09:48:55.08045
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-08-01	3360	2026-06-11 09:48:55.081465
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-08-07	3360	2026-06-11 09:48:55.08229
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-08-10	3360	2026-06-11 09:48:55.083075
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-08-13	3360	2026-06-11 09:48:55.083828
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-08-19	3360	2026-06-11 09:48:55.084608
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-08-22	3360	2026-06-11 09:48:55.085381
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-08-25	3360	2026-06-11 09:48:55.086167
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-08-31	3360	2026-06-11 09:48:55.086981
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-07-01	3660	2026-06-11 09:48:55.087742
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-07-04	3660	2026-06-11 09:48:55.088606
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-07-10	3660	2026-06-11 09:48:55.089496
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-07-13	3660	2026-06-11 09:48:55.0903
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-07-16	3660	2026-06-11 09:48:55.091137
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-07-22	3660	2026-06-11 09:48:55.091945
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-07-25	3660	2026-06-11 09:48:55.092718
7c142186-bdf1-4dd8-b174-5884468ae26a	2025-07-28	3660	2026-06-11 09:48:55.09357
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-06-02	4560	2026-06-11 09:48:55.095311
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-06-03	3900	2026-06-11 09:48:55.096216
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-06-04	4320	2026-06-11 09:48:55.097217
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-06-06	4080	2026-06-11 09:48:55.098028
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-06-07	4500	2026-06-11 09:48:55.098836
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-06-08	3840	2026-06-11 09:48:55.099608
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-06-10	4680	2026-06-11 09:48:55.10041
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-06-11	4020	2026-06-11 09:48:55.101173
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-05-01	3540	2026-06-11 09:48:55.101951
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-05-07	2820	2026-06-11 09:48:55.102693
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-05-10	3000	2026-06-11 09:48:55.103472
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-05-13	3180	2026-06-11 09:48:55.104241
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-05-19	3540	2026-06-11 09:48:55.105022
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-05-22	3720	2026-06-11 09:48:55.105879
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-05-25	2820	2026-06-11 09:48:55.10672
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-05-31	3180	2026-06-11 09:48:55.107491
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-04-01	3840	2026-06-11 09:48:55.108336
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-04-04	2940	2026-06-11 09:48:55.109118
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-04-10	3300	2026-06-11 09:48:55.109886
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-04-13	3480	2026-06-11 09:48:55.110751
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-04-16	3660	2026-06-11 09:48:55.111537
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-04-22	2940	2026-06-11 09:48:55.112516
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-04-25	3120	2026-06-11 09:48:55.113413
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-04-28	3300	2026-06-11 09:48:55.114217
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-03-01	3060	2026-06-11 09:48:55.115039
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-03-04	3240	2026-06-11 09:48:55.115857
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-03-07	3420	2026-06-11 09:48:55.116944
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-03-13	3780	2026-06-11 09:48:55.117855
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-03-16	2880	2026-06-11 09:48:55.118736
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-03-19	3060	2026-06-11 09:48:55.119637
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-03-25	3420	2026-06-11 09:48:55.120526
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-03-28	3600	2026-06-11 09:48:55.121427
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-03-31	3780	2026-06-11 09:48:55.12233
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-02-04	3540	2026-06-11 09:48:55.123209
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-02-07	3720	2026-06-11 09:48:55.124088
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-02-10	2820	2026-06-11 09:48:55.125091
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-02-16	3180	2026-06-11 09:48:55.12625
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-02-19	3360	2026-06-11 09:48:55.127207
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-02-22	3540	2026-06-11 09:48:55.128299
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-02-28	2820	2026-06-11 09:48:55.129149
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-01-01	3660	2026-06-11 09:48:55.129952
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-01-07	2940	2026-06-11 09:48:55.130731
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-01-10	3120	2026-06-11 09:48:55.131569
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-01-13	3300	2026-06-11 09:48:55.132419
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-01-19	3660	2026-06-11 09:48:55.133369
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-01-22	3840	2026-06-11 09:48:55.134158
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-01-25	2940	2026-06-11 09:48:55.134916
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2026-01-31	3300	2026-06-11 09:48:55.135706
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-12-01	2880	2026-06-11 09:48:55.136752
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-12-04	3060	2026-06-11 09:48:55.137734
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-12-10	3420	2026-06-11 09:48:55.138676
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-12-13	3600	2026-06-11 09:48:55.13954
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-12-16	3780	2026-06-11 09:48:55.14034
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-12-22	3060	2026-06-11 09:48:55.141139
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-12-25	3240	2026-06-11 09:48:55.141932
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-12-28	3420	2026-06-11 09:48:55.142807
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-11-01	3180	2026-06-11 09:48:55.143818
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-11-04	3360	2026-06-11 09:48:55.144623
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-11-07	3540	2026-06-11 09:48:55.145411
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-11-13	2820	2026-06-11 09:48:55.146176
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-11-16	3000	2026-06-11 09:48:55.147037
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-11-19	3180	2026-06-11 09:48:55.147835
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-11-25	3540	2026-06-11 09:48:55.148636
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-11-28	3720	2026-06-11 09:48:55.149394
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-10-04	3660	2026-06-11 09:48:55.150158
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-10-07	3840	2026-06-11 09:48:55.150908
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-10-10	2940	2026-06-11 09:48:55.151697
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-10-16	3300	2026-06-11 09:48:55.152567
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-10-19	3480	2026-06-11 09:48:55.153476
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-10-22	3660	2026-06-11 09:48:55.154363
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-10-28	2940	2026-06-11 09:48:55.155278
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-10-31	3120	2026-06-11 09:48:55.156133
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-09-01	3780	2026-06-11 09:48:55.156961
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-09-07	3060	2026-06-11 09:48:55.157767
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-09-10	3240	2026-06-11 09:48:55.1589
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-09-13	3420	2026-06-11 09:48:55.15993
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-09-19	3780	2026-06-11 09:48:55.160967
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-09-22	2880	2026-06-11 09:48:55.161962
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-09-25	3060	2026-06-11 09:48:55.162976
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-08-01	3000	2026-06-11 09:48:55.164005
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-08-04	3180	2026-06-11 09:48:55.165162
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-08-10	3540	2026-06-11 09:48:55.166218
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-08-13	3720	2026-06-11 09:48:55.16745
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-08-16	2820	2026-06-11 09:48:55.168464
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-08-22	3180	2026-06-11 09:48:55.169488
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-08-25	3360	2026-06-11 09:48:55.170487
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-08-28	3540	2026-06-11 09:48:55.171444
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-07-01	3300	2026-06-11 09:48:55.172426
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-07-04	3480	2026-06-11 09:48:55.173672
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-07-07	3660	2026-06-11 09:48:55.174807
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-07-13	2940	2026-06-11 09:48:55.175941
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-07-16	3120	2026-06-11 09:48:55.177017
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-07-19	3300	2026-06-11 09:48:55.178001
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-07-25	3660	2026-06-11 09:48:55.179005
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-07-28	3840	2026-06-11 09:48:55.180222
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	2025-07-31	2940	2026-06-11 09:48:55.181271
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-06-02	4080	2026-06-11 09:48:55.183246
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-06-03	3480	2026-06-11 09:48:55.184241
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-06-04	3960	2026-06-11 09:48:55.185171
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-06-05	3360	2026-06-11 09:48:55.18611
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-06-07	3240	2026-06-11 09:48:55.187086
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-06-08	3720	2026-06-11 09:48:55.188082
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-06-09	3120	2026-06-11 09:48:55.189077
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-06-10	3600	2026-06-11 09:48:55.190096
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-05-01	3180	2026-06-11 09:48:55.190962
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-05-04	2460	2026-06-11 09:48:55.191885
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-05-07	2820	2026-06-11 09:48:55.192779
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-05-13	2460	2026-06-11 09:48:55.193703
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-05-16	2820	2026-06-11 09:48:55.194815
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-05-19	3180	2026-06-11 09:48:55.195952
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-05-22	2460	2026-06-11 09:48:55.197064
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-05-28	3180	2026-06-11 09:48:55.198128
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-05-31	2460	2026-06-11 09:48:55.199184
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-04-01	2400	2026-06-11 09:48:55.200271
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-04-07	3120	2026-06-11 09:48:55.201382
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-04-10	2400	2026-06-11 09:48:55.202469
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-04-13	2760	2026-06-11 09:48:55.20361
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-04-16	3120	2026-06-11 09:48:55.204803
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-04-22	2760	2026-06-11 09:48:55.206329
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-04-25	3120	2026-06-11 09:48:55.207559
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-04-28	2400	2026-06-11 09:48:55.208818
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-03-01	2700	2026-06-11 09:48:55.209974
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-03-04	3060	2026-06-11 09:48:55.211009
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-03-07	3420	2026-06-11 09:48:55.212049
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-03-10	2700	2026-06-11 09:48:55.212923
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-03-16	3420	2026-06-11 09:48:55.213772
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-03-19	2700	2026-06-11 09:48:55.214621
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-03-22	3060	2026-06-11 09:48:55.215471
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-03-25	3420	2026-06-11 09:48:55.21634
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-03-31	3060	2026-06-11 09:48:55.217196
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-02-01	3000	2026-06-11 09:48:55.218064
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-02-04	3360	2026-06-11 09:48:55.218879
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-02-10	3000	2026-06-11 09:48:55.219719
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-02-13	3360	2026-06-11 09:48:55.220865
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-02-16	2640	2026-06-11 09:48:55.221825
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-02-19	3000	2026-06-11 09:48:55.222752
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-02-25	2640	2026-06-11 09:48:55.223624
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-02-28	3000	2026-06-11 09:48:55.224435
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-01-04	2580	2026-06-11 09:48:55.225493
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-01-07	2940	2026-06-11 09:48:55.226327
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-01-10	3300	2026-06-11 09:48:55.227178
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-01-13	2580	2026-06-11 09:48:55.227988
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-01-19	3300	2026-06-11 09:48:55.228815
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-01-22	2580	2026-06-11 09:48:55.229616
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-01-25	2940	2026-06-11 09:48:55.230406
78079a64-de94-4d1d-8e32-e82c30d574b3	2026-01-28	3300	2026-06-11 09:48:55.231171
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-12-01	2520	2026-06-11 09:48:55.231976
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-12-04	2880	2026-06-11 09:48:55.232781
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-12-07	3240	2026-06-11 09:48:55.233589
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-12-13	2880	2026-06-11 09:48:55.234341
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-12-16	3240	2026-06-11 09:48:55.235136
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-12-19	2520	2026-06-11 09:48:55.236083
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-12-22	2880	2026-06-11 09:48:55.237011
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-12-28	2520	2026-06-11 09:48:55.237796
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-12-31	2880	2026-06-11 09:48:55.238548
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-11-01	2820	2026-06-11 09:48:55.239294
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-11-07	2460	2026-06-11 09:48:55.240042
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-11-10	2820	2026-06-11 09:48:55.240767
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-11-13	3180	2026-06-11 09:48:55.241635
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-11-16	2460	2026-06-11 09:48:55.24246
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-11-22	3180	2026-06-11 09:48:55.243223
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-11-25	2460	2026-06-11 09:48:55.243968
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-11-28	2820	2026-06-11 09:48:55.244701
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-10-01	3120	2026-06-11 09:48:55.245443
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-10-04	2400	2026-06-11 09:48:55.246194
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-10-07	2760	2026-06-11 09:48:55.246935
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-10-10	3120	2026-06-11 09:48:55.24771
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-10-16	2760	2026-06-11 09:48:55.248453
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-10-19	3120	2026-06-11 09:48:55.249185
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-10-22	2400	2026-06-11 09:48:55.249991
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-10-25	2760	2026-06-11 09:48:55.250939
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-10-31	2400	2026-06-11 09:48:55.251881
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-09-01	3420	2026-06-11 09:48:55.252655
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-09-04	2700	2026-06-11 09:48:55.253548
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-09-10	3420	2026-06-11 09:48:55.254846
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-09-13	2700	2026-06-11 09:48:55.255974
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-09-16	3060	2026-06-11 09:48:55.257616
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-09-19	3420	2026-06-11 09:48:55.258769
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-09-25	3060	2026-06-11 09:48:55.260108
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-09-28	3420	2026-06-11 09:48:55.262171
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-08-04	3000	2026-06-11 09:48:55.263836
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-08-07	3360	2026-06-11 09:48:55.265792
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-08-10	2640	2026-06-11 09:48:55.267072
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-08-13	3000	2026-06-11 09:48:55.268247
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-08-19	2640	2026-06-11 09:48:55.269462
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-08-22	3000	2026-06-11 09:48:55.270899
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-08-25	3360	2026-06-11 09:48:55.272108
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-08-28	2640	2026-06-11 09:48:55.273077
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-07-01	2940	2026-06-11 09:48:55.273911
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-07-04	3300	2026-06-11 09:48:55.274954
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-07-07	2580	2026-06-11 09:48:55.275873
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-07-13	3300	2026-06-11 09:48:55.276716
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-07-16	2580	2026-06-11 09:48:55.277564
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-07-19	2940	2026-06-11 09:48:55.278362
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-07-22	3300	2026-06-11 09:48:55.279132
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-07-28	2940	2026-06-11 09:48:55.27991
78079a64-de94-4d1d-8e32-e82c30d574b3	2025-07-31	3300	2026-06-11 09:48:55.280682
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-06-01	3060	2026-06-11 09:48:55.282145
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-06-02	2520	2026-06-11 09:48:55.282984
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-06-03	3060	2026-06-11 09:48:55.283731
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-06-04	2520	2026-06-11 09:48:55.28445
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-06-06	2520	2026-06-11 09:48:55.285162
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-06-07	3060	2026-06-11 09:48:55.285885
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-06-08	2520	2026-06-11 09:48:55.286689
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-06-09	3060	2026-06-11 09:48:55.287422
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-06-11	3060	2026-06-11 09:48:55.288146
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-05-01	2820	2026-06-11 09:48:55.288855
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-05-07	2820	2026-06-11 09:48:55.289557
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-05-10	2280	2026-06-11 09:48:55.290261
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-05-13	2820	2026-06-11 09:48:55.291152
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-05-16	2280	2026-06-11 09:48:55.292034
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-05-22	2280	2026-06-11 09:48:55.292844
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-05-25	2820	2026-06-11 09:48:55.293829
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-05-28	2280	2026-06-11 09:48:55.294568
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-05-31	2820	2026-06-11 09:48:55.295281
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-04-01	2040	2026-06-11 09:48:55.295988
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-04-04	2580	2026-06-11 09:48:55.296688
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-04-07	2040	2026-06-11 09:48:55.297383
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-04-10	2580	2026-06-11 09:48:55.298443
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-04-16	2580	2026-06-11 09:48:55.299326
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-04-19	2040	2026-06-11 09:48:55.300071
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-04-22	2580	2026-06-11 09:48:55.300798
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-04-25	2040	2026-06-11 09:48:55.301512
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-03-01	2340	2026-06-11 09:48:55.302224
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-03-04	2880	2026-06-11 09:48:55.302928
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-03-10	2880	2026-06-11 09:48:55.303634
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-03-13	2340	2026-06-11 09:48:55.304352
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-03-16	2880	2026-06-11 09:48:55.305061
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-03-19	2340	2026-06-11 09:48:55.305772
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-03-25	2340	2026-06-11 09:48:55.306471
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-03-28	2880	2026-06-11 09:48:55.307169
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-03-31	2340	2026-06-11 09:48:55.30792
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-02-04	2100	2026-06-11 09:48:55.308994
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-02-07	2640	2026-06-11 09:48:55.309865
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-02-10	2100	2026-06-11 09:48:55.310663
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-02-13	2640	2026-06-11 09:48:55.31146
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-02-19	2640	2026-06-11 09:48:55.312445
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-02-22	2100	2026-06-11 09:48:55.313517
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-02-25	2640	2026-06-11 09:48:55.314601
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-02-28	2100	2026-06-11 09:48:55.315462
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-01-01	2940	2026-06-11 09:48:55.316294
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-01-04	2400	2026-06-11 09:48:55.317088
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-01-07	2940	2026-06-11 09:48:55.317882
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-01-13	2940	2026-06-11 09:48:55.318639
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-01-16	2400	2026-06-11 09:48:55.319448
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-01-19	2940	2026-06-11 09:48:55.320259
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-01-22	2400	2026-06-11 09:48:55.321083
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-01-28	2400	2026-06-11 09:48:55.321964
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2026-01-31	2940	2026-06-11 09:48:55.322754
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-12-01	2160	2026-06-11 09:48:55.323519
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-12-07	2160	2026-06-11 09:48:55.324304
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-12-10	2700	2026-06-11 09:48:55.325177
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-12-13	2160	2026-06-11 09:48:55.325974
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-12-16	2700	2026-06-11 09:48:55.32671
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-12-22	2700	2026-06-11 09:48:55.32745
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-12-25	2160	2026-06-11 09:48:55.32824
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-12-28	2700	2026-06-11 09:48:55.329213
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-12-31	2160	2026-06-11 09:48:55.330012
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-11-01	2460	2026-06-11 09:48:55.330834
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-11-04	3000	2026-06-11 09:48:55.331619
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-11-07	2460	2026-06-11 09:48:55.332374
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-11-10	3000	2026-06-11 09:48:55.333112
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-11-16	3000	2026-06-11 09:48:55.333875
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-11-19	2460	2026-06-11 09:48:55.334614
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-11-22	3000	2026-06-11 09:48:55.335349
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-11-25	2460	2026-06-11 09:48:55.336108
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-10-01	2760	2026-06-11 09:48:55.336833
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-10-04	2220	2026-06-11 09:48:55.337578
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-10-10	2220	2026-06-11 09:48:55.338294
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-10-13	2760	2026-06-11 09:48:55.33904
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-10-16	2220	2026-06-11 09:48:55.339754
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-10-19	2760	2026-06-11 09:48:55.340467
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-10-25	2760	2026-06-11 09:48:55.341215
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-10-28	2220	2026-06-11 09:48:55.342077
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-10-31	2760	2026-06-11 09:48:55.342809
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-09-04	2520	2026-06-11 09:48:55.343518
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-09-07	1980	2026-06-11 09:48:55.344327
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-09-10	2520	2026-06-11 09:48:55.345118
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-09-13	1980	2026-06-11 09:48:55.345845
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-09-19	1980	2026-06-11 09:48:55.346562
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-09-22	2520	2026-06-11 09:48:55.347287
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-09-25	1980	2026-06-11 09:48:55.347993
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-09-28	2520	2026-06-11 09:48:55.348697
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-08-01	2280	2026-06-11 09:48:55.349473
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-08-04	2820	2026-06-11 09:48:55.350216
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-08-07	2280	2026-06-11 09:48:55.350937
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-08-13	2280	2026-06-11 09:48:55.351653
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-08-16	2820	2026-06-11 09:48:55.352361
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-08-19	2280	2026-06-11 09:48:55.353057
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-08-22	2820	2026-06-11 09:48:55.353761
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-08-28	2820	2026-06-11 09:48:55.354479
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-08-31	2280	2026-06-11 09:48:55.355181
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-07-01	2580	2026-06-11 09:48:55.355875
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-07-07	2580	2026-06-11 09:48:55.356574
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-07-10	2040	2026-06-11 09:48:55.357271
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-07-13	2580	2026-06-11 09:48:55.358009
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-07-16	2040	2026-06-11 09:48:55.358716
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-07-22	2040	2026-06-11 09:48:55.359459
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-07-25	2580	2026-06-11 09:48:55.360237
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-07-28	2040	2026-06-11 09:48:55.360939
4fbfad70-0d7e-4b0a-9836-97fa708177a0	2025-07-31	2580	2026-06-11 09:48:55.361653
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-06-01	2520	2026-06-11 09:48:55.363083
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-06-02	2040	2026-06-11 09:48:55.363787
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-06-03	2640	2026-06-11 09:48:55.364489
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-06-04	2160	2026-06-11 09:48:55.365184
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-06-05	2760	2026-06-11 09:48:55.365881
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-06-07	2880	2026-06-11 09:48:55.366572
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-06-08	2400	2026-06-11 09:48:55.367255
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-06-09	1920	2026-06-11 09:48:55.367949
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-06-10	2520	2026-06-11 09:48:55.368638
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-06-11	2040	2026-06-11 09:48:55.369373
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-05-01	2460	2026-06-11 09:48:55.370076
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-05-04	2100	2026-06-11 09:48:55.370775
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-05-07	1740	2026-06-11 09:48:55.371477
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-05-10	2460	2026-06-11 09:48:55.372165
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-05-13	2100	2026-06-11 09:48:55.372864
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-05-16	1740	2026-06-11 09:48:55.373554
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-05-19	2460	2026-06-11 09:48:55.374234
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-05-22	2100	2026-06-11 09:48:55.375111
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-05-25	1740	2026-06-11 09:48:55.375877
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-05-28	2460	2026-06-11 09:48:55.376563
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-05-31	2100	2026-06-11 09:48:55.377306
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-04-01	1680	2026-06-11 09:48:55.378194
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-04-07	2040	2026-06-11 09:48:55.378928
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-04-13	2400	2026-06-11 09:48:55.379641
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-04-19	1680	2026-06-11 09:48:55.380314
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-04-25	2040	2026-06-11 09:48:55.381023
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-03-01	1980	2026-06-11 09:48:55.381694
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-03-04	1620	2026-06-11 09:48:55.382371
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-03-07	2340	2026-06-11 09:48:55.383042
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-03-10	1980	2026-06-11 09:48:55.383733
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-03-13	1620	2026-06-11 09:48:55.384407
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-03-16	2340	2026-06-11 09:48:55.38511
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-03-19	1980	2026-06-11 09:48:55.385778
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-03-22	1620	2026-06-11 09:48:55.386452
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-03-25	2340	2026-06-11 09:48:55.38712
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-03-28	1980	2026-06-11 09:48:55.387857
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-03-31	1620	2026-06-11 09:48:55.388533
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-02-01	2280	2026-06-11 09:48:55.389199
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-02-04	1920	2026-06-11 09:48:55.390037
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-02-07	1560	2026-06-11 09:48:55.390767
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-02-10	2280	2026-06-11 09:48:55.391473
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-02-13	1920	2026-06-11 09:48:55.392149
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-02-16	1560	2026-06-11 09:48:55.392845
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-02-19	2280	2026-06-11 09:48:55.393522
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-02-22	1920	2026-06-11 09:48:55.39421
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-02-25	1560	2026-06-11 09:48:55.394924
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-02-28	2280	2026-06-11 09:48:55.39561
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-01-04	2220	2026-06-11 09:48:55.396398
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-01-10	2580	2026-06-11 09:48:55.397118
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-01-16	1860	2026-06-11 09:48:55.397846
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-01-22	2220	2026-06-11 09:48:55.398521
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-01-28	2580	2026-06-11 09:48:55.399197
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-12-01	1800	2026-06-11 09:48:55.399868
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-12-04	2520	2026-06-11 09:48:55.400595
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-12-07	2160	2026-06-11 09:48:55.401272
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-12-10	1800	2026-06-11 09:48:55.401919
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-12-13	2520	2026-06-11 09:48:55.4026
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-12-16	2160	2026-06-11 09:48:55.403319
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-12-19	1800	2026-06-11 09:48:55.404088
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-12-22	2520	2026-06-11 09:48:55.404795
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-12-25	2160	2026-06-11 09:48:55.405609
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-12-28	1800	2026-06-11 09:48:55.406442
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-12-31	2520	2026-06-11 09:48:55.407176
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-11-01	2100	2026-06-11 09:48:55.407889
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-11-04	1740	2026-06-11 09:48:55.408572
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-11-07	2460	2026-06-11 09:48:55.40941
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-11-10	2100	2026-06-11 09:48:55.410124
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-11-13	1740	2026-06-11 09:48:55.410802
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-11-16	2460	2026-06-11 09:48:55.411475
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-11-19	2100	2026-06-11 09:48:55.412144
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-11-22	1740	2026-06-11 09:48:55.412838
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-11-25	2460	2026-06-11 09:48:55.413504
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-11-28	2100	2026-06-11 09:48:55.414197
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-10-01	2400	2026-06-11 09:48:55.414863
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-10-07	1680	2026-06-11 09:48:55.415546
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-10-13	2040	2026-06-11 09:48:55.416221
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-10-19	2400	2026-06-11 09:48:55.416912
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-10-25	1680	2026-06-11 09:48:55.417608
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-10-31	2040	2026-06-11 09:48:55.41829
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-09-01	1620	2026-06-11 09:48:55.418984
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-09-04	2340	2026-06-11 09:48:55.419684
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-09-07	1980	2026-06-11 09:48:55.420366
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-09-10	1620	2026-06-11 09:48:55.421162
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-09-13	2340	2026-06-11 09:48:55.422052
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-09-16	1980	2026-06-11 09:48:55.422889
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-09-19	1620	2026-06-11 09:48:55.423685
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-09-22	2340	2026-06-11 09:48:55.424429
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-09-25	1980	2026-06-11 09:48:55.425143
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-09-28	1620	2026-06-11 09:48:55.42586
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-08-01	1920	2026-06-11 09:48:55.426555
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-08-04	1560	2026-06-11 09:48:55.427258
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-08-07	2280	2026-06-11 09:48:55.427951
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-08-10	1920	2026-06-11 09:48:55.428638
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-08-13	1560	2026-06-11 09:48:55.429321
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-08-16	2280	2026-06-11 09:48:55.430013
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-08-19	1920	2026-06-11 09:48:55.430712
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-08-22	1560	2026-06-11 09:48:55.431417
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-08-25	2280	2026-06-11 09:48:55.432145
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-08-28	1920	2026-06-11 09:48:55.432832
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-08-31	1560	2026-06-11 09:48:55.433551
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-07-04	1860	2026-06-11 09:48:55.43428
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-07-10	2220	2026-06-11 09:48:55.434944
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-07-16	2580	2026-06-11 09:48:55.435646
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-07-22	1860	2026-06-11 09:48:55.436479
0b44b67d-63b3-4705-9464-c5f6b279866a	2025-07-28	2220	2026-06-11 09:48:55.437282
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-01	1980	2026-06-11 09:48:55.438833
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-02	1560	2026-06-11 09:48:55.439553
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-03	2220	2026-06-11 09:48:55.440224
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-04	1800	2026-06-11 09:48:55.440898
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-06	2040	2026-06-11 09:48:55.441597
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-07	1620	2026-06-11 09:48:55.442269
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-08	2280	2026-06-11 09:48:55.442962
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-09	1860	2026-06-11 09:48:55.443637
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-10	1440	2026-06-11 09:48:55.444321
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-05-01	2100	2026-06-11 09:48:55.445005
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-05-07	1740	2026-06-11 09:48:55.445681
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-05-13	1380	2026-06-11 09:48:55.446374
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-05-19	2100	2026-06-11 09:48:55.447047
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-05-25	1740	2026-06-11 09:48:55.447725
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-05-31	1380	2026-06-11 09:48:55.448443
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-04-01	1320	2026-06-11 09:48:55.449123
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-04-04	1140	2026-06-11 09:48:55.449801
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-04-07	2040	2026-06-11 09:48:55.450476
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-04-10	1860	2026-06-11 09:48:55.45114
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-04-13	1680	2026-06-11 09:48:55.451999
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-04-16	1500	2026-06-11 09:48:55.452855
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-04-19	1320	2026-06-11 09:48:55.453562
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-04-22	1140	2026-06-11 09:48:55.454296
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-04-25	2040	2026-06-11 09:48:55.454996
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-04-28	1860	2026-06-11 09:48:55.45567
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-03-01	1620	2026-06-11 09:48:55.456374
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-03-04	1440	2026-06-11 09:48:55.457031
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-03-07	1260	2026-06-11 09:48:55.457725
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-03-10	2160	2026-06-11 09:48:55.458435
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-03-13	1980	2026-06-11 09:48:55.459116
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-03-16	1800	2026-06-11 09:48:55.459814
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-03-19	1620	2026-06-11 09:48:55.460508
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-03-22	1440	2026-06-11 09:48:55.46118
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-03-25	1260	2026-06-11 09:48:55.461845
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-03-28	2160	2026-06-11 09:48:55.462515
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-03-31	1980	2026-06-11 09:48:55.463209
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-02-04	1740	2026-06-11 09:48:55.463859
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-02-10	1380	2026-06-11 09:48:55.464537
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-02-16	2100	2026-06-11 09:48:55.46526
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-02-22	1740	2026-06-11 09:48:55.465943
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-02-28	1380	2026-06-11 09:48:55.466615
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-01-01	1140	2026-06-11 09:48:55.467387
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-01-04	2040	2026-06-11 09:48:55.468115
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-01-07	1860	2026-06-11 09:48:55.468792
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-01-10	1680	2026-06-11 09:48:55.46949
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-01-13	1500	2026-06-11 09:48:55.470164
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-01-16	1320	2026-06-11 09:48:55.470836
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-01-19	1140	2026-06-11 09:48:55.471552
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-01-22	2040	2026-06-11 09:48:55.472241
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-01-25	1860	2026-06-11 09:48:55.472926
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-01-28	1680	2026-06-11 09:48:55.473619
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-01-31	1500	2026-06-11 09:48:55.474336
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-12-01	1440	2026-06-11 09:48:55.475029
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-12-04	1260	2026-06-11 09:48:55.475719
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-12-07	2160	2026-06-11 09:48:55.476396
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-12-10	1980	2026-06-11 09:48:55.477087
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-12-13	1800	2026-06-11 09:48:55.477762
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-12-16	1620	2026-06-11 09:48:55.478441
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-12-19	1440	2026-06-11 09:48:55.479107
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-12-22	1260	2026-06-11 09:48:55.479777
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-12-25	2160	2026-06-11 09:48:55.480437
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-12-28	1980	2026-06-11 09:48:55.481106
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-12-31	1800	2026-06-11 09:48:55.481782
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-11-01	1740	2026-06-11 09:48:55.482674
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-11-07	1380	2026-06-11 09:48:55.483481
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-11-13	2100	2026-06-11 09:48:55.484323
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-11-19	1740	2026-06-11 09:48:55.485018
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-11-25	1380	2026-06-11 09:48:55.485698
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-10-01	2040	2026-06-11 09:48:55.486385
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-10-04	1860	2026-06-11 09:48:55.487059
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-10-07	1680	2026-06-11 09:48:55.48774
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-10-10	1500	2026-06-11 09:48:55.488426
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-10-13	1320	2026-06-11 09:48:55.489162
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-10-16	1140	2026-06-11 09:48:55.490143
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-10-19	2040	2026-06-11 09:48:55.490939
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-10-22	1860	2026-06-11 09:48:55.491704
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-10-25	1680	2026-06-11 09:48:55.492414
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-10-28	1500	2026-06-11 09:48:55.493086
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-10-31	1320	2026-06-11 09:48:55.49386
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-09-01	1260	2026-06-11 09:48:55.494553
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-09-04	2160	2026-06-11 09:48:55.49522
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-09-07	1980	2026-06-11 09:48:55.495944
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-09-10	1800	2026-06-11 09:48:55.496636
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-09-13	1620	2026-06-11 09:48:55.4973
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-09-16	1440	2026-06-11 09:48:55.498143
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-09-19	1260	2026-06-11 09:48:55.499111
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-09-22	2160	2026-06-11 09:48:55.500049
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-09-25	1980	2026-06-11 09:48:55.501077
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-09-28	1800	2026-06-11 09:48:55.502141
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-08-04	1380	2026-06-11 09:48:55.503046
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-08-10	2100	2026-06-11 09:48:55.503919
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-08-16	1740	2026-06-11 09:48:55.504743
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-08-22	1380	2026-06-11 09:48:55.505546
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-08-28	2100	2026-06-11 09:48:55.506341
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-07-01	1860	2026-06-11 09:48:55.507141
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-07-04	1680	2026-06-11 09:48:55.507953
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-07-07	1500	2026-06-11 09:48:55.50872
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-07-10	1320	2026-06-11 09:48:55.509481
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-07-13	1140	2026-06-11 09:48:55.510231
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-07-16	2040	2026-06-11 09:48:55.510991
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-07-19	1860	2026-06-11 09:48:55.511749
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-07-22	1680	2026-06-11 09:48:55.512541
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-07-25	1500	2026-06-11 09:48:55.513304
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-07-28	1320	2026-06-11 09:48:55.514214
34e079cb-e041-4085-9a31-a0782fdd5af8	2025-07-31	1140	2026-06-11 09:48:55.515044
0b44b67d-63b3-4705-9464-c5f6b279866a	2026-06-17	7	2026-06-17 15:04:24.990854
0a70cf27-dd6e-4891-981f-a6fa185fdbed	2026-06-17	170	2026-06-17 16:03:37.045185
7806ded9-937b-4975-83ea-a9336f9c9a73	2026-06-18	181	2026-06-18 09:47:40.687317
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-22	150	2026-06-22 20:02:00.059213
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-12	1642	2026-06-12 13:25:51.000242
5d533fb3-8bab-4e32-8a70-2fd3d523e378	2026-06-22	570	2026-06-22 15:02:40.569352
5a708101-a917-4e6f-bf93-0a960a638577	2026-06-19	1455	2026-06-19 09:41:16.176405
dac8e393-f03e-4776-a6c5-6a3fcba12943	2026-06-20	53	2026-06-20 15:29:43.64386
0a70cf27-dd6e-4891-981f-a6fa185fdbed	2026-06-20	26	2026-06-20 16:13:08.888084
212f41f2-9c73-4550-9baf-03116c6ce289	2026-06-12	13	2026-06-12 09:46:08.453921
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-06-18	12	2026-06-18 14:55:01.291775
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-16	412	2026-06-16 23:55:41.795563
d01930fd-10cb-4705-82f3-de179a2c514f	2026-06-12	321	2026-06-12 09:54:47.467135
29954a24-1c8a-4878-a70b-5c226a02a94b	2026-06-12	172	2026-06-12 10:31:09.808214
3b7eda8e-0bc1-4c47-bf69-6ccebb484d4a	2026-06-12	9	2026-06-12 10:35:04.32319
9cb5fd28-5944-4407-9ed5-a1c6522f0b42	2026-06-12	85	2026-06-12 10:37:06.786186
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-20	2068	2026-06-20 21:49:51.9575
6e77fac8-4f86-4f0f-ba81-be4e9d51c977	2026-06-17	46	2026-06-17 21:59:06.187606
e5f739d4-47d8-43fa-bb54-dfb074511cb4	2026-06-17	38	2026-06-17 22:02:50.644741
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-17	1728	2026-06-17 22:12:03.707687
ae23b160-380d-4fc9-ba21-7dd6fbe04d54	2026-06-17	5	2026-06-17 22:29:43.722566
e87b1064-01b8-4369-a98f-4c16da9c91fe	2026-06-18	460	2026-06-18 15:54:19.313271
5a708101-a917-4e6f-bf93-0a960a638577	2026-06-22	1592	2026-06-22 20:53:30.289997
7c142186-bdf1-4dd8-b174-5884468ae26a	2026-06-21	248	2026-06-21 07:46:30.358155
34e079cb-e041-4085-9a31-a0782fdd5af8	2026-06-18	1737	2026-06-18 19:01:17.782013
5a708101-a917-4e6f-bf93-0a960a638577	2026-06-18	72	2026-06-18 22:37:31.766411
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	2026-06-22	44	2026-06-22 19:46:07.353591
\.


--
-- Data for Name: userachievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.userachievements (userid, achievementid, unlockedat) FROM stdin;
\.


--
-- Data for Name: usercollections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usercollections (id, userid, name, description, createdat, ispublic, reviewstatus, submittedat, reviewedat, reviewedby, updatedat) FROM stdin;
8e17afd7-b5f3-4931-be51-09ff4ff5332a	7c142186-bdf1-4dd8-b174-5884468ae26a	fruit	\N	2026-05-14 09:02:45.087206	f	approved	\N	\N	\N	2026-06-05 09:36:40.973499+07
3bb2b53a-6723-498d-bc1f-174bc86b118b	63067d89-05de-4a11-9fe9-1fba5b52ea9e	Daily Conversations A1-A2	Từ vựng giao tiếp hằng ngày cho chào hỏi, lịch trình và tình huống quen thuộc.	2026-06-05 09:59:50.716151	t	approved	2026-06-05 09:59:50.716151+07	2026-06-05 09:59:50.716151+07	63067d89-05de-4a11-9fe9-1fba5b52ea9e	2026-06-05 09:59:50.754417+07
878650b5-f646-4c01-b91a-a2b2fdf963b1	63067d89-05de-4a11-9fe9-1fba5b52ea9e	Travel & Services A2-B1	Từ vựng dùng khi đi du lịch, đặt dịch vụ, hỏi đường và xử lý sự cố đơn giản.	2026-06-05 09:59:50.756691	t	approved	2026-06-05 09:59:50.756691+07	2026-06-05 09:59:50.756691+07	63067d89-05de-4a11-9fe9-1fba5b52ea9e	2026-06-05 09:59:50.786321+07
72a27d3e-3c8f-4978-b142-4392b45cfc04	63067d89-05de-4a11-9fe9-1fba5b52ea9e	Work & Study B1	Từ vựng học tập và công việc: deadline, họp nhóm, phản hồi và tiến độ.	2026-06-05 09:59:50.78841	t	approved	2026-06-05 09:59:50.78841+07	2026-06-05 09:59:50.78841+07	63067d89-05de-4a11-9fe9-1fba5b52ea9e	2026-06-05 09:59:50.836679+07
fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	63067d89-05de-4a11-9fe9-1fba5b52ea9e	IELTS Topic Vocabulary B1-B2	Từ vựng nền cho các chủ đề IELTS phổ biến như môi trường, xã hội và giáo dục.	2026-06-05 09:59:50.838736	t	approved	2026-06-05 09:59:50.838736+07	2026-06-05 09:59:50.838736+07	63067d89-05de-4a11-9fe9-1fba5b52ea9e	2026-06-05 09:59:50.869047+07
0c7c0175-304a-42ec-985c-13fd46a9dba8	34e079cb-e041-4085-9a31-a0782fdd5af8	hihi	chàoo	2026-06-05 10:07:37.421127	t	approved	2026-06-12 10:08:42.509966+07	2026-06-18 22:36:14.844029+07	63067d89-05de-4a11-9fe9-1fba5b52ea9e	2026-06-18 22:36:14.844029+07
\.


--
-- Data for Name: usercollectionwords; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usercollectionwords (id, collectionid, customword, custommeaning, customexample, addedat, updatedat) FROM stdin;
42438c18-bc28-4927-9bd7-b1c6eb6df905	3bb2b53a-6723-498d-bc1f-174bc86b118b	greeting	lời chào	A friendly greeting can start a good conversation.	2026-06-05 09:59:50.722521	2026-06-05 09:59:50.722521+07
0d17b1a8-f523-4321-9ea0-208e72c4daea	3bb2b53a-6723-498d-bc1f-174bc86b118b	appointment	cuộc hẹn	I have a doctor appointment at three oclock.	2026-06-05 09:59:50.725607	2026-06-05 09:59:50.725607+07
8ea6c92d-8066-4709-a30a-706ffc473c2f	3bb2b53a-6723-498d-bc1f-174bc86b118b	schedule	lịch trình	My schedule is full this morning.	2026-06-05 09:59:50.7306	2026-06-05 09:59:50.7306+07
f520c223-7daf-41bb-bbbc-0e1ef0d69831	3bb2b53a-6723-498d-bc1f-174bc86b118b	nearby	ở gần đây	Is there a pharmacy nearby?	2026-06-05 09:59:50.733532	2026-06-05 09:59:50.733532+07
f656ef07-d966-4954-92f4-c75beb372430	3bb2b53a-6723-498d-bc1f-174bc86b118b	available	có sẵn, rảnh	Are you available after lunch?	2026-06-05 09:59:50.736122	2026-06-05 09:59:50.736122+07
79ab8cb1-c1d2-4bab-b6d9-7e6fbfc0035c	3bb2b53a-6723-498d-bc1f-174bc86b118b	prefer	thích hơn	I prefer tea to coffee.	2026-06-05 09:59:50.738213	2026-06-05 09:59:50.738213+07
40526b48-6424-43f0-bca1-f9bc6d24e2ed	3bb2b53a-6723-498d-bc1f-174bc86b118b	usually	thường xuyên	I usually wake up at six thirty.	2026-06-05 09:59:50.740126	2026-06-05 09:59:50.740126+07
00fa7db2-ddba-4d09-9021-16add9aaad7e	3bb2b53a-6723-498d-bc1f-174bc86b118b	borrow	mượn	Can I borrow your pen for a minute?	2026-06-05 09:59:50.742597	2026-06-05 09:59:50.742597+07
56cfd7b5-566f-424c-a6cc-df72d22e1e6f	3bb2b53a-6723-498d-bc1f-174bc86b118b	receipt	hóa đơn	Please keep the receipt.	2026-06-05 09:59:50.74656	2026-06-05 09:59:50.74656+07
b1ae5327-8393-4417-8076-4c9193dbb710	3bb2b53a-6723-498d-bc1f-174bc86b118b	crowded	đông đúc	The bus is crowded today.	2026-06-05 09:59:50.74932	2026-06-05 09:59:50.74932+07
13e2bb30-ce0a-4abe-aaa5-f30bcc22cf7f	3bb2b53a-6723-498d-bc1f-174bc86b118b	polite	lịch sự	It is polite to say thank you.	2026-06-05 09:59:50.751298	2026-06-05 09:59:50.751298+07
a2805afb-65c9-409d-8ade-ca78ad101647	3bb2b53a-6723-498d-bc1f-174bc86b118b	remind	nhắc nhở	Please remind me to call Anna.	2026-06-05 09:59:50.753251	2026-06-05 09:59:50.753251+07
db9e21c4-4cbe-4ff3-9956-2a879aa66655	878650b5-f646-4c01-b91a-a2b2fdf963b1	reservation	sự đặt chỗ	We have a reservation for two nights.	2026-06-05 09:59:50.759062	2026-06-05 09:59:50.759062+07
8b264739-5a3b-49d1-aab0-f38cd1e37152	878650b5-f646-4c01-b91a-a2b2fdf963b1	luggage	hành lý	My luggage is near the taxi.	2026-06-05 09:59:50.762382	2026-06-05 09:59:50.762382+07
50719b07-c7aa-4778-9948-489885e7bff2	878650b5-f646-4c01-b91a-a2b2fdf963b1	boarding pass	thẻ lên máy bay	Please show your boarding pass at the gate.	2026-06-05 09:59:50.765264	2026-06-05 09:59:50.765264+07
e740a447-5680-4595-81a6-19bd3e2d9a7f	878650b5-f646-4c01-b91a-a2b2fdf963b1	delay	sự chậm trễ, trì hoãn	The flight has a short delay.	2026-06-05 09:59:50.7671	2026-06-05 09:59:50.7671+07
9be5b340-bcf0-42cd-acfe-534af449ae7e	878650b5-f646-4c01-b91a-a2b2fdf963b1	cancel	hủy	I need to cancel my booking.	2026-06-05 09:59:50.769109	2026-06-05 09:59:50.769109+07
8180a15f-a125-4862-b854-937bf7b90c2c	878650b5-f646-4c01-b91a-a2b2fdf963b1	entrance fee	phí vào cửa	The entrance fee is five dollars.	2026-06-05 09:59:50.771151	2026-06-05 09:59:50.771151+07
f8ce8ee7-b5d3-4a77-907d-6c305f448abc	878650b5-f646-4c01-b91a-a2b2fdf963b1	itinerary	lịch trình chuyến đi	Our itinerary includes three cities.	2026-06-05 09:59:50.773045	2026-06-05 09:59:50.773045+07
4eafa4d3-d6d7-4f0b-b146-bbf38b1282fc	878650b5-f646-4c01-b91a-a2b2fdf963b1	directions	chỉ dẫn đường đi	Can you give me directions to the station?	2026-06-05 09:59:50.774749	2026-06-05 09:59:50.774749+07
5c6a932a-b2fa-4112-af36-023f66a95f94	878650b5-f646-4c01-b91a-a2b2fdf963b1	exchange	đổi, trao đổi	Where can I exchange money?	2026-06-05 09:59:50.777099	2026-06-05 09:59:50.777099+07
fa20fdb7-72e8-4120-ad95-2607d4cba0c4	878650b5-f646-4c01-b91a-a2b2fdf963b1	recommend	giới thiệu, đề xuất	Can you recommend a local restaurant?	2026-06-05 09:59:50.780963	2026-06-05 09:59:50.780963+07
f1ace5ff-5574-44c0-8069-452120143cc9	878650b5-f646-4c01-b91a-a2b2fdf963b1	single room	phòng đơn	I booked a single room for tonight.	2026-06-05 09:59:50.782905	2026-06-05 09:59:50.782905+07
12ac9192-6928-4c0f-9462-f917d78b348a	878650b5-f646-4c01-b91a-a2b2fdf963b1	customer service	dịch vụ khách hàng	Customer service helped me change the ticket.	2026-06-05 09:59:50.784926	2026-06-05 09:59:50.784926+07
017b9933-3906-4863-a576-5361b70eed2a	72a27d3e-3c8f-4978-b142-4392b45cfc04	deadline	hạn chót	The deadline for the report is Friday.	2026-06-05 09:59:50.790669	2026-06-05 09:59:50.790669+07
34a57f49-56d1-4255-b4cd-63727d16dca4	72a27d3e-3c8f-4978-b142-4392b45cfc04	assignment	bài tập được giao	The teacher gave us a writing assignment.	2026-06-05 09:59:50.792576	2026-06-05 09:59:50.792576+07
28630f28-2998-44f1-bf54-50d0126572dd	72a27d3e-3c8f-4978-b142-4392b45cfc04	attend	tham dự	I will attend the meeting online.	2026-06-05 09:59:50.79623	2026-06-05 09:59:50.79623+07
eb479fba-1847-4968-9ccf-5594c5490e5d	72a27d3e-3c8f-4978-b142-4392b45cfc04	submit	nộp	Please submit your homework before midnight.	2026-06-05 09:59:50.817681	2026-06-05 09:59:50.817681+07
66a59bc6-a1e5-4964-880c-5590a79a29cc	72a27d3e-3c8f-4978-b142-4392b45cfc04	colleague	đồng nghiệp	My colleague helped me prepare the slides.	2026-06-05 09:59:50.819635	2026-06-05 09:59:50.819635+07
93ec78b2-d9ae-46a6-a297-fa7f87128c4b	72a27d3e-3c8f-4978-b142-4392b45cfc04	presentation	bài thuyết trình	Her presentation was clear and confident.	2026-06-05 09:59:50.821544	2026-06-05 09:59:50.821544+07
3dd84225-bdb9-40de-b3e4-419ad9304120	72a27d3e-3c8f-4978-b142-4392b45cfc04	research	nghiên cứu	We need more research before making a decision.	2026-06-05 09:59:50.823535	2026-06-05 09:59:50.823535+07
b7da0d2c-dc54-4456-9003-7b41758884a8	72a27d3e-3c8f-4978-b142-4392b45cfc04	feedback	phản hồi	The manager gave useful feedback.	2026-06-05 09:59:50.82535	2026-06-05 09:59:50.82535+07
1b9579ec-0b2e-40a9-aec3-255388f399d7	72a27d3e-3c8f-4978-b142-4392b45cfc04	priority	việc ưu tiên	Improving speaking is my priority this month.	2026-06-05 09:59:50.828135	2026-06-05 09:59:50.828135+07
1a360752-a0c4-4381-b905-f34d673c9b6f	72a27d3e-3c8f-4978-b142-4392b45cfc04	requirement	yêu cầu	The course has a final project requirement.	2026-06-05 09:59:50.831378	2026-06-05 09:59:50.831378+07
07b75902-6c4a-44be-8ed1-fa6642a3335f	72a27d3e-3c8f-4978-b142-4392b45cfc04	progress	tiến độ	I can see progress after two weeks.	2026-06-05 09:59:50.833503	2026-06-05 09:59:50.833503+07
962fa159-2b5c-4368-9307-338ace80098e	72a27d3e-3c8f-4978-b142-4392b45cfc04	improve	cải thiện	Practice helps you improve your pronunciation.	2026-06-05 09:59:50.835541	2026-06-05 09:59:50.835541+07
9faccd99-5853-46e7-b5b4-148b3560d46e	fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	sustainable	bền vững	Cities need sustainable transport systems.	2026-06-05 09:59:50.841358	2026-06-05 09:59:50.841358+07
8f0bbb3b-793b-4546-9ec8-65456859b3ae	fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	emissions	khí thải	Car emissions can harm air quality.	2026-06-05 09:59:50.843201	2026-06-05 09:59:50.843201+07
c5e49181-5f54-4199-a575-460a4862ed1a	fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	conserve	bảo tồn, tiết kiệm	We should conserve water during dry seasons.	2026-06-05 09:59:50.847593	2026-06-05 09:59:50.847593+07
34dc9ac3-af3a-4f9c-8cbc-648148ee135d	fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	impact	tác động	Technology has a major impact on education.	2026-06-05 09:59:50.849807	2026-06-05 09:59:50.849807+07
62edee37-0b95-4c1c-ac83-4598be4a4ffd	fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	evidence	bằng chứng	The report provides clear evidence.	2026-06-05 09:59:50.851632	2026-06-05 09:59:50.851632+07
e72d62e4-3bc9-41f9-9001-8b6658324eeb	fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	policy	chính sách	The new policy supports online learning.	2026-06-05 09:59:50.853364	2026-06-05 09:59:50.853364+07
3d54a9d0-13ac-4574-8580-afb44c00876c	fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	shortage	sự thiếu hụt	Some areas have a shortage of clean water.	2026-06-05 09:59:50.855424	2026-06-05 09:59:50.855424+07
7ef20eda-379f-4d94-8e7e-86ad04e5e872	fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	significant	đáng kể, quan trọng	There was a significant increase in sales.	2026-06-05 09:59:50.857473	2026-06-05 09:59:50.857473+07
bc6e82a0-8f73-4441-9958-8b5651dc7342	fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	reliable	đáng tin cậy	Students need reliable information sources.	2026-06-05 09:59:50.859491	2026-06-05 09:59:50.859491+07
e9c1e01c-e179-4b61-ac49-7191f0516b9b	fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	challenge	thách thức	Time management is a common challenge.	2026-06-05 09:59:50.863171	2026-06-05 09:59:50.863171+07
879a4f80-3b05-4267-ba14-0f6202b2c62a	fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	factor	yếu tố	Cost is an important factor for many families.	2026-06-05 09:59:50.866087	2026-06-05 09:59:50.866087+07
6b7c9477-e8e0-45cb-86da-68883948225d	fbee136d-1a3a-41d9-bd87-c8b32c65b1bf	solution	giải pháp	Public transport can be part of the solution.	2026-06-05 09:59:50.867986	2026-06-05 09:59:50.867986+07
b3b10733-7b91-4d12-b312-ae410c2b1db1	0c7c0175-304a-42ec-985c-13fd46a9dba8	hi	chào	\N	2026-06-05 10:19:49.561246	2026-06-05 10:19:49.561246+07
bbde9709-e287-411c-ae51-26bc3a63b6f8	0c7c0175-304a-42ec-985c-13fd46a9dba8	chicken	con gà	\N	2026-06-05 10:20:00.237382	2026-06-05 10:20:00.237382+07
9292374b-0270-4ee0-95b4-65b0f3766dc4	0c7c0175-304a-42ec-985c-13fd46a9dba8	eafewfewe	test	\N	2026-06-05 10:20:11.170712	2026-06-05 10:20:11.170712+07
3b2c9ec0-13af-4fd4-bfcc-cdba5c9df272	0c7c0175-304a-42ec-985c-13fd46a9dba8	.	.	\N	2026-06-05 10:20:21.249701	2026-06-05 10:20:23.924667+07
3a40685c-cc27-4efa-8c39-5728e5472211	0c7c0175-304a-42ec-985c-13fd46a9dba8	foundation	thành lập,sáng lập; tổ chức; sự thành lập; Sự thành lập	The foundation of his institute has been wrought with difficulty.	2026-06-12 10:08:42.489563	2026-06-12 10:08:42.489563+07
\.


--
-- Data for Name: usererrorevents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usererrorevents (id, userid, skill, activitytype, referencetype, referenceid, errortype, errorkey, severity, prompt, useranswer, expectedanswer, feedback, metadata, createdat) FROM stdin;
83e43233-37fc-4919-9b07-2036011e09e0	7c142186-bdf1-4dd8-b174-5884468ae26a	listening	listening_comprehension	listening_question	4d4d168b-58fb-4681-bd76-f320268af0ff	multiple_choice	listening_multiple_choice	5	What is the conversation mainly about?	A bus ticket	Morning routines	Anna and Ben talk about waking up, breakfast, and going out in the morning.	{"score": 0, "lessonId": "bd620079-7933-41f4-a825-bbae50ab23c7", "completed": false}	2026-05-24 14:13:07.148824
a8a985b2-5f23-4dee-9035-961abb14bc5d	7c142186-bdf1-4dd8-b174-5884468ae26a	listening	listening_comprehension	listening_question	ad0ebb3c-8467-4c13-a904-39c530f04a90	true_false	listening_true_false	5	Ben catches the bus at seven fifteen.	false	true	Ben says he catches the bus at seven fifteen.	{"score": 0, "lessonId": "bd620079-7933-41f4-a825-bbae50ab23c7", "completed": false}	2026-05-24 14:13:07.163827
5fe656fe-5d6c-4008-9a4b-e7f69b05bd96	7c142186-bdf1-4dd8-b174-5884468ae26a	listening	listening_comprehension	listening_question	1d7c3f57-2f8d-40fc-b383-8cbb2e9171b3	fill_blank	listening_fill_blank	5	Anna drinks coffee and reads the ____.	sds	news	The missing word is "news".	{"score": 0, "lessonId": "bd620079-7933-41f4-a825-bbae50ab23c7", "completed": false}	2026-05-24 14:13:07.167983
5d3b3284-72c8-4d5b-ae03-ae0473a6ffab	7c142186-bdf1-4dd8-b174-5884468ae26a	reading	reading_comprehension	reading_question	285dd15c-e630-4d7a-863a-a0c176a99e08	multiple_choice	reading_multiple_choice	5	1	4	6	7	{"score": 25, "lessonId": "873d0162-3e45-4a54-9b86-5bddd9cc54f4", "completed": false}	2026-05-24 14:14:19.930819
170cb4cd-2fe5-4a99-a073-7797b82e19e1	7c142186-bdf1-4dd8-b174-5884468ae26a	reading	reading_comprehension	reading_question	e54fd0b6-0d91-402c-ba58-827dc892ce9b	true_false	reading_true_false	5	A healthy breakfast must be complicated.	true	false	The passage says a healthy breakfast does not need to be complicated.	{"score": 25, "lessonId": "873d0162-3e45-4a54-9b86-5bddd9cc54f4", "completed": false}	2026-05-24 14:14:19.943016
3a884df8-801d-4031-ad3c-42a8e8e65b78	7c142186-bdf1-4dd8-b174-5884468ae26a	reading	reading_comprehension	reading_question	17fb01c1-336a-4d21-a76a-3346c85e05ca	fill_blank	reading_fill_blank	5	It is better to drink water or ____ instead of sweet drinks.	sds	milk	The final paragraph mentions water or milk.	{"score": 25, "lessonId": "873d0162-3e45-4a54-9b86-5bddd9cc54f4", "completed": false}	2026-05-24 14:14:19.947467
357e62e9-9706-4a0c-8347-802c0388b73c	7c142186-bdf1-4dd8-b174-5884468ae26a	writing	writing_check	writing_exercise	ec47499f-c5a0-4392-9f83-efd484dd8668	writing_accuracy	cau_viet_chua_at_o_chinh_xac	5	Tháng trước, lớp tôi tham gia một cuộc thi nói tiếng Anh ở trường.	sdsdsd	Last month, my class joined an English speaking contest at school.	Chưa đủ chính xác, hãy xem lại đáp án nhé.	{"score": 6, "source": "similarity", "lessonId": "a1775087-7de6-46f1-89db-012fac05246b", "exerciseId": "ec47499f-c5a0-4392-9f83-efd484dd8668", "grammarNotes": [], "correctedText": "Last month, my class joined an English speaking contest at school.", "naturalnessNotes": []}	2026-05-24 14:14:33.308635
d7d3b88e-958e-4262-ac74-4e420337fc40	7c142186-bdf1-4dd8-b174-5884468ae26a	grammar	grammar_quiz	grammar_quiz	30faf047-71f8-48fd-9842-71b46204adfc	grammar_topic	ong_tu_khuyet_thieu_can_could_must_should_may_might	4	It's Sunday. I ___ go to work today.	D	B	= Không cần đi làm (vì Chủ nhật). don't have to = không cần.	{"topicId": "ae1a29d5-7711-46ff-bfed-f66c51979174", "categoryId": 42, "topicTitle": "Modal Verbs", "topicTitleVI": "Động từ khuyết thiếu: can, could, must, should, may, might"}	2026-05-24 14:15:36.58407
34e0a17e-34c9-4454-a98b-b152eac61d50	7c142186-bdf1-4dd8-b174-5884468ae26a	grammar	grammar_quiz	grammar_quiz	9c55d75a-a4b0-4f7b-a2a9-450c548174b5	grammar_topic	ong_tu_khuyet_thieu_can_could_must_should_may_might	4	___ I use your phone, please?	B	C	Xin phép lịch sự → May I...?	{"topicId": "ae1a29d5-7711-46ff-bfed-f66c51979174", "categoryId": 42, "topicTitle": "Modal Verbs", "topicTitleVI": "Động từ khuyết thiếu: can, could, must, should, may, might"}	2026-05-24 14:15:36.597531
fe9a4bdb-c1fa-4fad-b0ea-4027b8b30bc1	7c142186-bdf1-4dd8-b174-5884468ae26a	grammar	grammar_quiz	grammar_quiz	5fd4ee9c-4b20-4169-8b71-a9f4919c7c15	grammar_topic	ong_tu_khuyet_thieu_can_could_must_should_may_might	4	She ___ be at home. Her car is in the driveway.	C	A	Suy đoán chắc chắn (có bằng chứng: xe đỗ ở đó) → must.	{"topicId": "ae1a29d5-7711-46ff-bfed-f66c51979174", "categoryId": 42, "topicTitle": "Modal Verbs", "topicTitleVI": "Động từ khuyết thiếu: can, could, must, should, may, might"}	2026-05-24 14:15:36.602504
9017f2d6-3f73-4df1-b68e-38aab37813c5	7c142186-bdf1-4dd8-b174-5884468ae26a	grammar	grammar_quiz	grammar_quiz	874334c2-36d9-4c81-9f48-1afaeaf513ae	grammar_topic	gioi_tu_chi_thoi_gian_in_on_at_va_noi_chon	4	She was born ___ 1995.	A	B	Năm → in.	{"topicId": "d773bd1b-24cd-4d51-9fad-bd84fa4cb41a", "categoryId": 46, "topicTitle": "Prepositions of Time & Place", "topicTitleVI": "Giới từ chỉ thời gian (in, on, at) và nơi chốn"}	2026-05-24 14:16:11.760537
71e8e6f7-54eb-473c-9d11-c9efe835460c	7c142186-bdf1-4dd8-b174-5884468ae26a	grammar	grammar_quiz	grammar_quiz	0ac3241c-122c-4171-aed9-92d2ba0ed238	grammar_topic	gioi_tu_chi_thoi_gian_in_on_at_va_noi_chon	4	The meeting is ___ Monday ___ 9 AM.	C	B	Thứ → on. Giờ → at.	{"topicId": "d773bd1b-24cd-4d51-9fad-bd84fa4cb41a", "categoryId": 46, "topicTitle": "Prepositions of Time & Place", "topicTitleVI": "Giới từ chỉ thời gian (in, on, at) và nơi chốn"}	2026-05-24 14:16:11.771435
faeceba8-6497-40fa-9527-dfcadc0fb8ff	7c142186-bdf1-4dd8-b174-5884468ae26a	grammar	grammar_quiz	grammar_quiz	908ba7f3-471f-474b-addb-661b3f409cc5	grammar_topic	gioi_tu_chi_thoi_gian_in_on_at_va_noi_chon	4	There is a picture ___ the wall.	D	B	Trên bề mặt tường → on the wall.	{"topicId": "d773bd1b-24cd-4d51-9fad-bd84fa4cb41a", "categoryId": 46, "topicTitle": "Prepositions of Time & Place", "topicTitleVI": "Giới từ chỉ thời gian (in, on, at) và nơi chốn"}	2026-05-24 14:16:11.774833
0b682551-9fa3-4395-9f09-2cfb09389654	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-2	speaking_accuracy	unsportsmanlike	4	Why did the referee give a yellow card?	for unspoken man-gly's behavior.	For unsportsmanlike behavior	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: unsportsmanlike.	{"score": 56, "lessonId": "41c60189-522a-4c29-83ce-9ec076f96648", "threshold": 80, "extraWords": ["unspoken", "man", "gly's"], "questionId": "ai-q-2", "missingWords": ["unsportsmanlike"]}	2026-05-24 21:06:42.983907
03250330-22fe-41a0-ab7d-f4a75148ee7e	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-2	speaking_accuracy	foul	4	Why did the referee give a yellow card?	Saw a minor fall.	For a minor foul	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: foul.	{"score": 53, "lessonId": "41c60189-522a-4c29-83ce-9ec076f96648", "threshold": 80, "extraWords": ["saw", "fall"], "questionId": "ai-q-2", "missingWords": ["foul"]}	2026-05-24 21:07:02.264983
17db10b1-1739-4fa0-8495-884836dfee77	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-2	speaking_accuracy	foul	3	Why did the referee give a yellow card?	For a minor part.	For a minor foul	Khá ổn, nhưng còn vài từ chưa rõ hoặc chưa đúng thứ tự. Cần chú ý: foul.	{"score": 68, "lessonId": "41c60189-522a-4c29-83ce-9ec076f96648", "threshold": 80, "extraWords": ["part"], "questionId": "ai-q-2", "missingWords": ["foul"]}	2026-05-24 21:07:15.54005
3ed27d1c-2086-4646-af80-ce0852aac0e6	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-2	speaking_accuracy	foul	3	Why did the referee give a yellow card?	For a minor fall	For a minor foul	Khá ổn, nhưng còn vài từ chưa rõ hoặc chưa đúng thứ tự. Cần chú ý: foul.	{"score": 68, "lessonId": "41c60189-522a-4c29-83ce-9ec076f96648", "threshold": 80, "extraWords": ["fall"], "questionId": "ai-q-2", "missingWords": ["foul"]}	2026-05-24 21:07:35.430764
d9fcaed7-83c4-46f5-9eef-a8e3d5e5c0a5	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-4	speaking_accuracy	will	4	What's the coach's strategy for the second half?	We focus on the face.	We'll focus on defense	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: will, defense.	{"score": 59, "lessonId": "41c60189-522a-4c29-83ce-9ec076f96648", "threshold": 80, "extraWords": ["face"], "questionId": "ai-q-4", "missingWords": ["will", "defense"]}	2026-05-24 21:08:27.942799
b3ef27a1-89bc-4fc1-bd08-5bfc41b33dd5	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-6	speaking_accuracy	first	4	What's the team's current ranking?	We are close please.	We're in first place	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: first, place.	{"score": 48, "lessonId": "41c60189-522a-4c29-83ce-9ec076f96648", "threshold": 80, "extraWords": ["close", "please"], "questionId": "ai-q-6", "missingWords": ["first", "place"]}	2026-05-24 21:09:06.91887
ce812c9b-4a7f-4d89-bd70-959ba7f1c339	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-6	speaking_accuracy	last	3	What's the team's current ranking?	We are in the next place.	We're in last place	Khá ổn, nhưng còn vài từ chưa rõ hoặc chưa đúng thứ tự. Cần chú ý: last.	{"score": 77, "lessonId": "41c60189-522a-4c29-83ce-9ec076f96648", "threshold": 80, "extraWords": ["next"], "questionId": "ai-q-6", "missingWords": ["last"]}	2026-05-24 21:09:18.578567
3febc98b-c61b-4fe6-8dd7-a508843c53ae	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-6	speaking_accuracy	we	5	What's the team's current ranking?	Where is the next place?	We're in last place	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: we, are, last.	{"score": 29, "lessonId": "41c60189-522a-4c29-83ce-9ec076f96648", "threshold": 80, "extraWords": ["where", "is", "next"], "questionId": "ai-q-6", "missingWords": ["we", "are", "last"]}	2026-05-24 21:09:29.977603
8b856cd3-4b29-4193-a739-e17ffe4e9332	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-7	speaking_accuracy	it	5	Can you describe the stadium?	is the best modern studio.	It's a big, modern stadium	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: it, big, stadium.	{"score": 41, "lessonId": "41c60189-522a-4c29-83ce-9ec076f96648", "threshold": 80, "extraWords": ["best", "studio"], "questionId": "ai-q-7", "missingWords": ["it", "big", "stadium"]}	2026-05-24 21:09:52.669382
174f3916-98c0-4dd4-b9cc-13de8fdd9b54	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-7	speaking_accuracy	it	5	Can you describe the stadium?	Isman, Australia	It's a small, old stadium	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: it, is, small, old, stadium.	{"score": 3, "lessonId": "41c60189-522a-4c29-83ce-9ec076f96648", "threshold": 80, "extraWords": ["isman", "australia"], "questionId": "ai-q-7", "missingWords": ["it", "is", "small", "old", "stadium"]}	2026-05-24 21:10:04.320681
3a2a9c0f-84e7-48b2-aa4f-4c8b6dd8441f	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-1	speaking_accuracy	your	4	What do you like about me?	Y'all smiley.	Your smile	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: your.	{"score": 46, "lessonId": "d5373d1a-28da-4ba1-a22c-a8b447139d07", "threshold": 80, "extraWords": ["y'all"], "questionId": "ai-q-1", "missingWords": ["your"]}	2026-05-24 21:11:20.86213
d0bb7903-74db-4afe-96b4-92946df6b55a	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-1	speaking_accuracy	your	5	What do you like about me?	Josh Miley	Your smile	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: your, smile.	{"score": 8, "lessonId": "d5373d1a-28da-4ba1-a22c-a8b447139d07", "threshold": 80, "extraWords": ["josh", "miley"], "questionId": "ai-q-1", "missingWords": ["your", "smile"]}	2026-05-24 21:11:31.900881
19bbf855-fb5a-46b1-92d9-8008b4813e59	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-3	speaking_accuracy	go	4	What do you like to do on dates?	Roto a movie.	Go to a movie	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: go.	{"score": 53, "lessonId": "d5373d1a-28da-4ba1-a22c-a8b447139d07", "threshold": 80, "extraWords": ["roto"], "questionId": "ai-q-3", "missingWords": ["go"]}	2026-05-24 21:12:03.622023
c0f1cce1-4f82-45a6-98a6-c2835853f4e5	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-3	speaking_accuracy	try	5	What do you like to do on dates?	So I do rest.	Try a new restaurant	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: try, new, restaurant.	{"score": 8, "lessonId": "d5373d1a-28da-4ba1-a22c-a8b447139d07", "threshold": 80, "extraWords": ["so", "i", "do", "rest"], "questionId": "ai-q-3", "missingWords": ["try", "new", "restaurant"]}	2026-05-24 21:12:14.162905
7ff731a8-4233-4a14-8647-0366ba5a9ba5	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-3	speaking_accuracy	try	3	What do you like to do on dates?	So I a new restaurant.	Try a new restaurant	Khá ổn, nhưng còn vài từ chưa rõ hoặc chưa đúng thứ tự. Cần chú ý: try.	{"score": 70, "lessonId": "d5373d1a-28da-4ba1-a22c-a8b447139d07", "threshold": 80, "extraWords": ["so", "i"], "questionId": "ai-q-3", "missingWords": ["try"]}	2026-05-24 21:12:26.568342
025a6540-33a4-491a-9a11-2a4b08d47222	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-3	speaking_accuracy	try	5	What do you like to do on dates?	Go for a walk.	Try a new restaurant	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: try, new, restaurant.	{"score": 20, "lessonId": "d5373d1a-28da-4ba1-a22c-a8b447139d07", "threshold": 80, "extraWords": ["go", "walk"], "questionId": "ai-q-3", "missingWords": ["try", "new", "restaurant"]}	2026-05-24 21:12:36.154959
505bd5e5-17ac-44ad-bc9e-c56e3e5ccf90	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-4	speaking_accuracy	them	3	Do you like romantic getaways?	Yes, I love love.	Yes, I love them	Khá ổn, nhưng còn vài từ chưa rõ hoặc chưa đúng thứ tự. Cần chú ý: them.	{"score": 77, "lessonId": "d5373d1a-28da-4ba1-a22c-a8b447139d07", "threshold": 80, "extraWords": ["love"], "questionId": "ai-q-4", "missingWords": ["them"]}	2026-05-24 21:12:57.19949
e0691c41-0028-4126-8139-c535682dffd9	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-4	speaking_accuracy	i	4	Do you like romantic getaways?	Yes, and the turn.	Yes, I love them	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: i, love.	{"score": 50, "lessonId": "d5373d1a-28da-4ba1-a22c-a8b447139d07", "threshold": 80, "extraWords": ["turn"], "questionId": "ai-q-4", "missingWords": ["i", "love"]}	2026-05-24 21:13:05.508046
38294214-fb9b-4eba-b148-11e681ca6708	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-7	speaking_accuracy	go	3	What do you like to do on a first date?	We're to a coffee shop.	Go to a coffee shop	Khá ổn, nhưng còn vài từ chưa rõ hoặc chưa đúng thứ tự. Cần chú ý: go.	{"score": 73, "lessonId": "d5373d1a-28da-4ba1-a22c-a8b447139d07", "threshold": 80, "extraWords": ["we", "are"], "questionId": "ai-q-7", "missingWords": ["go"]}	2026-05-24 21:15:20.550755
cfe98a7b-3cb2-459e-82a9-21f27b2204cc	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-7	speaking_accuracy	go	5	What do you like to do on a first date?	Hello, Joe Amusea.	Go to a museum	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: go, museum.	{"score": 6, "lessonId": "d5373d1a-28da-4ba1-a22c-a8b447139d07", "threshold": 80, "extraWords": ["hello", "joe", "amusea"], "questionId": "ai-q-7", "missingWords": ["go", "museum"]}	2026-05-24 21:15:30.899284
828d22ab-9d8a-41fd-ba7d-3d6516232469	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-7	speaking_accuracy	go	5	What do you like to do on a first date?	Take a walk in the park.	Go to a museum	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: go, museum.	{"score": 19, "lessonId": "d5373d1a-28da-4ba1-a22c-a8b447139d07", "threshold": 80, "extraWords": ["take", "walk", "park"], "questionId": "ai-q-7", "missingWords": ["go", "museum"]}	2026-05-24 21:15:39.565834
51beb963-1eff-477a-b484-fd13ef64714e	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-2	speaking_accuracy	i	5	Can you make it stronger?	Yes, okay.	Yes, I can	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: i, can.	{"score": 37, "lessonId": "03ca82c7-fe72-4fdb-accd-1e751535b957", "threshold": 80, "extraWords": ["okay"], "questionId": "ai-q-2", "missingWords": ["i", "can"]}	2026-05-26 16:51:27.708526
bf4b2eef-acc9-4b4c-a820-e221eadac092	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	f9b77c4d-e3d7-4df3-b29e-7f8a9c166774	speaking_accuracy	john	3	What is your name?	My name is Son.	My name is John.	Khá ổn, nhưng còn vài từ chưa rõ hoặc chưa đúng thứ tự. Cần chú ý: john.	{"score": 77, "lessonId": "f7c7bb21-bfad-4d5f-9057-aa493a6a2116", "threshold": 80, "extraWords": ["son"], "questionId": "f9b77c4d-e3d7-4df3-b29e-7f8a9c166774", "missingWords": ["john"]}	2026-05-26 18:53:13.595407
687b9501-87dd-41d1-bd59-c46e62c3fc0c	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	9447a5a9-b62e-4934-950c-a84663561683	speaking_accuracy	from	4	Tell me about yourself.	I am a student for all of it now.	I am a student from Vietnam.	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: from, vietnam.	{"score": 62, "lessonId": "d3c02bda-d397-43f2-8b34-305067ac0b6d", "threshold": 80, "extraWords": ["all", "it", "now"], "questionId": "9447a5a9-b62e-4934-950c-a84663561683", "missingWords": ["from", "vietnam"]}	2026-05-27 20:54:46.635068
f7b97d27-9db0-47d3-85e2-571fec485699	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	9447a5a9-b62e-4934-950c-a84663561683	speaking_accuracy	work	5	Tell me about yourself.	I will come to teach him.	I work as a teacher.	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: work, as, teacher.	{"score": 27, "lessonId": "d3c02bda-d397-43f2-8b34-305067ac0b6d", "threshold": 80, "extraWords": ["will", "come", "teach", "him"], "questionId": "9447a5a9-b62e-4934-950c-a84663561683", "missingWords": ["work", "as", "teacher"]}	2026-05-27 20:54:59.253964
5ef40cd1-5f21-4c50-b9ba-26bf61cd105f	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	9447a5a9-b62e-4934-950c-a84663561683	speaking_accuracy	love	4	Tell me about yourself.	I look travelling at Whitney.	I love traveling and reading.	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: love, reading.	{"score": 47, "lessonId": "d3c02bda-d397-43f2-8b34-305067ac0b6d", "threshold": 80, "extraWords": ["look", "whitney"], "questionId": "9447a5a9-b62e-4934-950c-a84663561683", "missingWords": ["love", "reading"]}	2026-05-27 20:55:09.471852
987a540b-5124-4be1-8db9-3a9456eff895	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	9447a5a9-b62e-4934-950c-a84663561683	speaking_accuracy	reading	3	Tell me about yourself.	I love traveling and everything.	I love traveling and reading.	Khá ổn, nhưng còn vài từ chưa rõ hoặc chưa đúng thứ tự. Cần chú ý: reading.	{"score": 79, "lessonId": "d3c02bda-d397-43f2-8b34-305067ac0b6d", "threshold": 80, "extraWords": ["everything"], "questionId": "9447a5a9-b62e-4934-950c-a84663561683", "missingWords": ["reading"]}	2026-05-27 20:55:18.007413
ca6d0b6f-da15-43d4-a059-071c1a80f7ba	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	f9b77c4d-e3d7-4df3-b29e-7f8a9c166774	speaking_accuracy	sarah	3	What is your name?	I am Sean O'Hall.	I am Sarah.	Khá ổn, nhưng còn vài từ chưa rõ hoặc chưa đúng thứ tự. Cần chú ý: sarah.	{"score": 65, "lessonId": "f7c7bb21-bfad-4d5f-9057-aa493a6a2116", "threshold": 80, "extraWords": ["sean", "o'hall"], "questionId": "f9b77c4d-e3d7-4df3-b29e-7f8a9c166774", "missingWords": ["sarah"]}	2026-05-27 23:52:09.958694
26d72a9d-162d-4017-aca0-12ddd935eedc	34e079cb-e041-4085-9a31-a0782fdd5af8	writing	writing_check	writing_exercise	f13e6609-0bdf-4465-a08e-2b750f9d4394	grammar	su_dung_my_name_is_e_gioi_thieu_ten_va_them_am_sau_i	3	Xin chào, tên tôi là Nam và tôi 25 tuổi.	Hi, i am Nam and I 25 years old	Hello, my name is Nam and I am 25 years old.	Bạn cần thêm từ 'hello' hoặc 'hi' ở đầu câu và sử dụng 'my name is' để giới thiệu tên. Ngữ pháp: Sử dụng 'my name is' để giới thiệu tên và thêm 'am' sau 'I'	{"score": 80, "source": "ai", "lessonId": "689823c2-883f-4eec-9dce-f93820865502", "exerciseId": "f13e6609-0bdf-4465-a08e-2b750f9d4394", "grammarNotes": ["Sử dụng 'my name is' để giới thiệu tên và thêm 'am' sau 'I'"], "correctedText": "Hello, my name is Nam and I am 25 years old.", "naturalnessNotes": []}	2026-05-27 23:52:52.376302
6b194e08-6a88-488d-a260-cc996a3288a9	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-2	speaking_accuracy	five	5	How much is this?	Find all of us	Five dollars	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: five, dollars.	{"score": 4, "lessonId": "4313ca7c-e7f0-4776-a2f1-7201285e95d0", "threshold": 80, "extraWords": ["find", "all", "us"], "questionId": "ai-q-2", "missingWords": ["five", "dollars"]}	2026-05-28 00:31:24.964173
bdc7cc43-9aba-43d5-8961-47e27a207094	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_pronunciation	speaking_question	ai-q-2	speaking_accuracy	three	5	How much is this?	Trace the mouse	Three dollars	Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm. Cần chú ý: three, dollars.	{"score": 5, "lessonId": "4313ca7c-e7f0-4776-a2f1-7201285e95d0", "threshold": 80, "extraWords": ["trace", "mouse"], "questionId": "ai-q-2", "missingWords": ["three", "dollars"]}	2026-05-28 00:31:36.206717
c50a3f32-d80d-4893-865e-fd0e0b53d723	4fbfad70-0d7e-4b0a-9836-97fa708177a0	listening	listening_comprehension	listening_question	4d4d168b-58fb-4681-bd76-f320268af0ff	multiple_choice	listening_multiple_choice	5	What is the conversation mainly about?	Weekend plans	Morning routines	Anna and Ben talk about waking up, breakfast, and going out in the morning.	{"score": 33, "lessonId": "bd620079-7933-41f4-a825-bbae50ab23c7", "completed": false}	2026-05-29 09:04:42.775018
a207d121-23c8-429c-9f53-e42afc388087	4fbfad70-0d7e-4b0a-9836-97fa708177a0	listening	listening_comprehension	listening_question	1d7c3f57-2f8d-40fc-b383-8cbb2e9171b3	fill_blank	listening_fill_blank	5	Anna drinks coffee and reads the ____.	ưqwdqw	news	The missing word is "news".	{"score": 33, "lessonId": "bd620079-7933-41f4-a825-bbae50ab23c7", "completed": false}	2026-05-29 09:04:42.89512
b8584379-7b72-4215-9508-f5d8c1f506b3	4fbfad70-0d7e-4b0a-9836-97fa708177a0	listening	listening_comprehension	listening_question	1d7c3f57-2f8d-40fc-b383-8cbb2e9171b3	fill_blank	listening_fill_blank	3	Anna drinks coffee and reads the ____.	231	news	The missing word is "news".	{"score": 67, "lessonId": "bd620079-7933-41f4-a825-bbae50ab23c7", "completed": false}	2026-05-29 09:05:00.325484
24d1cf52-587a-441b-81e1-fd5acffc4c25	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	game	mini_game	game_question	676e9351-ea3a-4dec-a09b-7c9f788a1af5	matching	game_matching	3	Apple	Nước	Apple	Đáp án đúng: Apple	{"passed": true, "levelId": "272f6249-9f90-4839-b660-f7fbc4e98927", "duration": 255, "scorePercent": 80}	2026-05-29 09:18:06.478084
87267dee-0729-4097-9831-610319055616	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	game	mini_game	game_question	495d4e79-10d6-49b0-b889-d3934b11fdda	truefalse	game_truefalse	3	Cat	true	false	Đáp án đúng: false	{"passed": true, "levelId": "272f6249-9f90-4839-b660-f7fbc4e98927", "duration": 255, "scorePercent": 80}	2026-05-29 09:18:06.483572
d74bf741-a0f7-452d-9698-fba31936732a	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	writing	writing_check	writing_exercise	f13e6609-0bdf-4465-a08e-2b750f9d4394	writing_accuracy	cau_viet_chua_at_o_chinh_xac	5	Xin chào, tên tôi là Nam và tôi 25 tuổi.	è	Hello, my name is Nam and I am 25 years old.	Chưa đủ chính xác, hãy xem lại đáp án nhé.	{"score": 0, "source": "similarity", "lessonId": "689823c2-883f-4eec-9dce-f93820865502", "exerciseId": "f13e6609-0bdf-4465-a08e-2b750f9d4394", "grammarNotes": [], "correctedText": "Hello, my name is Nam and I am 25 years old.", "naturalnessNotes": []}	2026-05-29 10:01:36.791423
d2fdb957-bc61-43f6-a405-4136e3921f49	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	writing	writing_check	writing_exercise	66cb5b77-e581-4805-8bf2-ab69c96febde	grammar	tu_from_thuong_i_truoc_quoc_gia_con_live_in_thuong_i_sau_quoc_gia	4	Tôi đến từ Việt Nam nhưng hiện tại tôi sống ở Nhật Bản.	i live in Viet Nam but currently i live in Japan	I am from Vietnam but currently I live in Japan.	Sai cách sử dụng dấu câu và từ 'from' trong câu. Ngữ pháp: Từ 'from' thường đi trước quốc gia, còn 'live in' thường đi sau quốc gia.	{"score": 67, "source": "ai", "lessonId": "689823c2-883f-4eec-9dce-f93820865502", "exerciseId": "66cb5b77-e581-4805-8bf2-ab69c96febde", "grammarNotes": ["Từ 'from' thường đi trước quốc gia, còn 'live in' thường đi sau quốc gia."], "correctedText": "I am from Vietnam but currently I live in Japan.", "naturalnessNotes": []}	2026-05-29 10:02:38.073069
15f2d307-b8d8-4a70-9dc7-e7e6e9f18563	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	game	mini_game	game_question	b5e41ef9-6fc1-4f64-860b-8d32e73007ff	truefalse	game_truefalse	3	Dogs can fly	true	false	Đáp án đúng: false	{"passed": true, "levelId": "013fdce3-0f74-4768-a98a-f512e26b0574", "duration": 40, "scorePercent": 90}	2026-05-29 10:28:10.099776
7564ecbb-a175-4870-a298-7ae48fa2b90b	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	game	mini_game	game_question	0d0706f9-782d-4a81-8163-13a42a4bbd09	truefalse	game_truefalse	3	Paris is the capital of Germany	true	false	Đáp án đúng: false	{"passed": true, "levelId": "c6ad2ac8-29c2-4e8d-99e3-8542ac56410e", "duration": 62, "scorePercent": 90}	2026-05-29 10:29:15.699452
\.


--
-- Data for Name: usergameprogress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usergameprogress (id, userid, levelid, score, stars, iscompleted, besttime, attempts, completedat) FROM stdin;
1eb4e935-5d36-4f66-bd8a-07f84407c817	3caa9c2a-cbcf-4d47-8949-1a1e6a987926	272f6249-9f90-4839-b660-f7fbc4e98927	70	2	t	75	1	2026-05-13 17:03:04.710961
2f71b73c-3388-4d8a-ae32-7fc23235b774	7c142186-bdf1-4dd8-b174-5884468ae26a	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	80	2	t	52	1	2026-05-15 09:29:08.772861
a4308e69-2cfc-4559-9bf0-6da0866b3fd5	7c142186-bdf1-4dd8-b174-5884468ae26a	c13eed73-58fc-4b72-8d11-0afc9232a2f9	60	1	t	60	1	2026-05-15 09:30:12.355892
654bbe43-f3d1-4787-92e1-64821dfc3bf9	7c142186-bdf1-4dd8-b174-5884468ae26a	0f74d8a0-b845-4939-95fa-15cbe624b29f	70	2	t	45	2	2026-05-15 09:32:15.430794
3985fc20-5928-4d2e-85d0-ba865e5a5bf9	34e079cb-e041-4085-9a31-a0782fdd5af8	272f6249-9f90-4839-b660-f7fbc4e98927	100	3	t	32	3	2026-05-18 16:17:37.460582
fd895391-f64b-4f83-b2b7-73f77a989621	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	272f6249-9f90-4839-b660-f7fbc4e98927	80	2	t	255	1	2026-05-29 09:18:06.432268
1f902d5a-9b4c-4d93-bedd-2370ebfbbc0b	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	90	3	t	62	1	2026-05-29 10:29:15.688647
8fa8ffbe-fdbd-4cf6-8e80-93c528dc9ca0	34e079cb-e041-4085-9a31-a0782fdd5af8	013fdce3-0f74-4768-a98a-f512e26b0574	100	3	t	36	3	2026-06-16 21:50:18.856892
92d336fc-6709-4688-aee9-e189bc19240a	5a708101-a917-4e6f-bf93-0a960a638577	c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	100	3	t	73	1	2026-06-19 08:37:39.613535
4bae94b6-bc84-4a04-940f-e5ab6c922b04	5a708101-a917-4e6f-bf93-0a960a638577	c13eed73-58fc-4b72-8d11-0afc9232a2f9	100	3	t	115	1	2026-06-19 08:40:28.576057
b195f5e4-d83f-4b31-85e3-20f8859f212b	5a708101-a917-4e6f-bf93-0a960a638577	0f74d8a0-b845-4939-95fa-15cbe624b29f	100	3	t	83	1	2026-06-19 08:41:58.286806
8980b1f0-f66a-407b-b30a-2eabb61a97aa	5d533fb3-8bab-4e32-8a70-2fd3d523e378	272f6249-9f90-4839-b660-f7fbc4e98927	0	0	f	121	2	\N
811d71bf-5e05-418c-a8d5-1095dd99cf68	5a708101-a917-4e6f-bf93-0a960a638577	013fdce3-0f74-4768-a98a-f512e26b0574	100	3	t	44	7	2026-06-19 08:36:22.857412
b7ce0f7f-627b-4310-b03d-dbdd09866d26	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	013fdce3-0f74-4768-a98a-f512e26b0574	90	3	t	34	2	2026-05-29 10:28:09.851394
949d446a-a2ed-41af-b26a-7293ee1b5f52	7c142186-bdf1-4dd8-b174-5884468ae26a	272f6249-9f90-4839-b660-f7fbc4e98927	100	3	t	29	5	2026-05-13 18:34:25.835721
fca2e33d-34ad-40dc-8fc1-7ed330196e23	7c142186-bdf1-4dd8-b174-5884468ae26a	013fdce3-0f74-4768-a98a-f512e26b0574	80	2	t	41	5	2026-05-14 23:58:10.866925
a4f71d94-08f5-4493-b53c-b48945f1f783	5a708101-a917-4e6f-bf93-0a960a638577	272f6249-9f90-4839-b660-f7fbc4e98927	100	3	t	28	9	2026-06-19 08:20:38.600513
7cf42018-4891-4409-957d-833c20dc8d8e	5a708101-a917-4e6f-bf93-0a960a638577	146f267b-a919-48cb-bcb8-bd2b72042a41	75	2	f	65	5	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, passwordhash, role, levelid, isactive, createdat, plan, plusexpiresat, avatarurl, onboardingcompleted, placementlevel, placementsource, placementcompletedat) FROM stdin;
63067d89-05de-4a11-9fe9-1fba5b52ea9e	superadmin	superadmin@system.com	$2a$10$ky8AGBo.xvidPAN79So9GOWk5ne6z3BhSOnm5TUomsKDmDUrwQPN.	superadmin	\N	t	2026-05-11 18:40:55.960678	free	\N	\N	t	basic	legacy	2026-06-12 09:22:58.353466+07
212f41f2-9c73-4550-9baf-03116c6ce289	iii	iii@gmail.com	$2a$10$zTXiEVVufaXt2s0.5lU9VOb/twyVYpppieZkIoptppGbs97MpOk6a	user	\N	t	2026-06-12 09:38:25.788062	free	\N	\N	t	basic	test	2026-06-12 09:45:33.931+07
3b7eda8e-0bc1-4c47-bf69-6ccebb484d4a	philong123	philong123@gmail.com	$2a$10$C01wgbKekKGueI9mGxy97ucVV9ggZOzNGP7M7qyAkFrqw6J9vVjVC	user	\N	t	2026-06-12 10:32:37.56889	free	\N	\N	t	basic	test	2026-06-12 10:34:49.288+07
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	philong	culitete@gmail.com	$2a$10$.OrVNcBONA8Mjn1a8FCY7./wRZmtcuCybNDkUBcWNbL4Js3bodlRm	user	\N	t	2026-05-11 10:37:31.936624	free	\N	\N	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
e9a6c3ce-b579-4775-9b5b-70641dbb47cd	qwe	qwe@gmail.com	$2a$10$3rG7ZoHF8mG4pSQM5hf6gONsJupq7zmGymGbXuse5v7UcXfZFSJAC	admin	\N	t	2026-05-13 11:52:40.540308	plus	2026-06-12 11:53:10.503328	\N	t	basic	legacy	2026-06-12 09:22:58.353466+07
22227f57-0aa9-4da0-b6ac-cfd00110b514	testuser_gemini	testuser_gemini@example.com	$2a$10$C7hAmcq0OG.anoJycEN2P.V9kiVN9lmQxcElLZfLz0EqQpzSS2ouu	user	\N	t	2026-05-11 10:57:55.45399	free	\N	\N	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
9d4376dd-f532-418c-ad64-5d4861c2271c	philongg	123@gmail.com	$2a$10$kNlPcMW.v7PA0H2Oc3b6JezrqYaY6NUXwRIQUgOtdZg4AYHH45dnW	user	\N	t	2026-05-13 11:01:09.595934	plus	2026-06-12 11:03:48.383128	\N	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
7806ded9-937b-4975-83ea-a9336f9c9a73	mmm	mmm@gmail.com	$2a$10$yUqyA..4A.o5C3bAIyTCSuI4h7pEWtZryfUbs//WGSX9ZBa9G4nTS	user	\N	t	2026-06-17 22:51:37.175118	free	\N	\N	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
78079a64-de94-4d1d-8e32-e82c30d574b3	zxc	zxc@gmail.com	$2a$10$e5jbmEvkTwB9sc2LRB0UfORdiTahFYK68ud0MxQ5BtCgCega07/sm	user	\N	t	2026-05-13 15:03:36.391521	plus	2026-06-12 15:04:06.800961	\N	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	vcx	asd@gmail.com	$2a$10$FDhykvph3JvG4uEobm3dQ.QPgRJpg7Ccjy28.WpVH.Fq4ma46g2wC	user	\N	t	2026-05-13 11:44:51.457469	plus	2026-06-12 11:52:17.56918	\N	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
d01930fd-10cb-4705-82f3-de179a2c514f	ccc	ccc@gmail.com	$2a$10$/KlLrH8MeJh3t7DswCKHAOxymlN/5BjVWp0amNPG8Sbnk2TTmyE96	user	\N	t	2026-06-12 09:47:09.306901	free	\N	\N	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
4fbfad70-0d7e-4b0a-9836-97fa708177a0	qaz	qaz@gmail.com	$2a$10$U/xDSMGewrkdJ/6908.nCOfzBG7tzsmhKWz6VgJljBR37Yxv/mdxu	user	\N	t	2026-05-14 09:42:31.241459	plus	2026-06-13 09:43:36.549543	https://res.cloudinary.com/dxw3kllnb/image/upload/v1778767654/lingoweb/avatars/user_4fbfad70-0d7e-4b0a-9836-97fa708177a0.jpg	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
0b44b67d-63b3-4705-9464-c5f6b279866a	ttt	ttt@gmail.com	$2a$10$avTgeqFukYERaRveIMc8DeqkeBdxjV1qAWXa/KirqVYXHNWZe7mz.	user	\N	t	2026-05-14 22:01:27.451321	free	\N	\N	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
34e079cb-e041-4085-9a31-a0782fdd5af8	anhthu	anhthu@gmail.com	$2a$10$849dznlVtDLKlLhyMuhfReFdakpLMjrpTknclCVctZ433qhChRagq	admin	\N	t	2026-05-18 15:19:33.228358	plus	2026-06-17 15:20:15.158453	https://res.cloudinary.com/dxw3kllnb/image/upload/v1779370755/lingoweb/avatars/user_34e079cb-e041-4085-9a31-a0782fdd5af8.jpg	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
29954a24-1c8a-4878-a70b-5c226a02a94b	zxcv	zxcv@gmail.com	$2a$10$Od0HVFSOOY5ZTvttAuKAyuB7NYkrGJ7WWAaKCYv/qNKyrkYcXUM5O	user	\N	t	2026-06-12 09:29:15.012448	free	\N	\N	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
9cb5fd28-5944-4407-9ed5-a1c6522f0b42	yyyy	yyyy@gmail.com	$2a$10$5v7B3k8/sMSUwWQu78NXbunuA.1VSPE3uYPZFTepfXRzMwpAFiJty	user	\N	t	2026-06-12 10:35:35.440151	free	\N	\N	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
7c142186-bdf1-4dd8-b174-5884468ae26a	abc	abc@gmail.com	$2a$10$20WUXR9vW8kqK0Awd1bcHu4v/xVSE3i4Qe2NxHyiBlTzSoL8NewHa	user	\N	t	2026-05-13 11:20:36.033911	plus	2026-06-12 15:03:14.720743	\N	t	new	survey	2026-06-20 16:28:21.569978+07
5a708101-a917-4e6f-bf93-0a960a638577	bbb	bbb@gmail.com	$2a$10$8nqzmfUo9dZB/rVXdgTv6ucqo4w0CKUuUaX4DDIi1RKqAF3Y.puMO	user	\N	t	2026-06-18 14:26:55.478835	free	\N	https://res.cloudinary.com/dxw3kllnb/image/upload/v1781836877/lingoweb/avatars/user_5a708101-a917-4e6f-bf93-0a960a638577.jpg	t	basic	test	2026-06-22 20:08:33.449759+07
6e77fac8-4f86-4f0f-ba81-be4e9d51c977	ssd	ssd@gmail.com	$2a$10$wQHsZmetYEmvkvgbLHl/0eHsXhrYM24FYTz7A8evCLCV3St4qmgHC	user	\N	t	2026-06-17 21:56:36.925853	free	\N	\N	t	basic	test	2026-06-17 21:57:43.506+07
ae23b160-380d-4fc9-ba21-7dd6fbe04d54	zxz	zxz@gmail.com	$2a$10$yIcx/69kriWsBWI2JEnxOOoxRHnkpqkTa6a1er8blLgz5OLF9Qx0a	user	\N	t	2026-06-17 22:24:32.066484	free	\N	\N	t	new	test	2026-06-17 22:29:22.994+07
e5f739d4-47d8-43fa-bb54-dfb074511cb4	rrr	rrr@gmail.com	$2a$10$lQaIb5caKg7qhPXHPaEhkecBhjfS//sL0T6O7jD90c1z2sx.66hZm	user	\N	t	2026-06-17 22:02:09.748712	free	\N	\N	t	basic	restored_default_basic	2026-06-18 14:58:15.206348+07
e87b1064-01b8-4369-a98f-4c16da9c91fe	uuu	uuu@gmail.com	$2a$10$YKjxHaJw/6exJGQHBZtiyuonQJmuVARBosMWnAMPN1uRvgbfADZq6	user	\N	t	2026-06-18 15:00:46.961278	free	\N	\N	t	new	survey	2026-06-18 15:00:48.566081+07
7717dfeb-efb1-4180-a1b7-8c6fc6e90cf1	philongne	philongne@system.com	$2a$10$iK6M0n0wfqUcf/ODwkb.euPYAhO006KmtP/QLl.DLNEpDMRYjq/oi	user	\N	t	2026-06-19 08:06:40.528271	free	\N	\N	t	new	survey	2026-06-19 08:08:04.727902+07
dac8e393-f03e-4776-a6c5-6a3fcba12943	longne	longne@gmail.com	$2a$10$kYIUtoU0tOEjidCRkQUfl.08ieZTWcKdIWaeiIawe8Cbg6lLSsg92	user	\N	t	2026-06-20 15:14:32.737314	free	\N	\N	t	basic	survey	2026-06-20 15:15:07.926139+07
7e4ca808-477c-4cf1-84eb-8d59fa43c580	cvc	cvc@gmail.com	$2a$10$sACCDwP0G6KxMbWaF3S/5Oojcwp7nP9hsdsdKYM/dymwrHVLrHbTy	user	\N	t	2026-06-20 15:29:59.930117	free	\N	\N	t	new	test	2026-06-20 15:35:34.812391+07
0a70cf27-dd6e-4891-981f-a6fa185fdbed	vvv	vvv@system.com	$2a$10$fGGpNe4zs5PcBnn3BkeQxOmHgaTmwufdkNFu.dgZJHNcDDNbXNyYW	user	\N	t	2026-06-17 15:05:17.95129	free	\N	\N	t	new	test	2026-06-20 16:11:20.723579+07
5d533fb3-8bab-4e32-8a70-2fd3d523e378	john	john@gmail.com	$2a$10$mICM/xerzgpxkWUZuUnAve/4pSOcfmw0JLUBR3dW79A82V83KC.nO	user	\N	t	2026-06-22 10:07:13.840108	free	\N	\N	t	new	survey	2026-06-22 10:08:18.225947+07
\.


--
-- Data for Name: userstats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.userstats (userid, exp, level, streakdays, lastlogin) FROM stdin;
7e4ca808-477c-4cf1-84eb-8d59fa43c580	10	1	0	2026-06-20 15:29:59.932705
22227f57-0aa9-4da0-b6ac-cfd00110b514	3571	9	19	2026-05-11 10:57:55.515252
9d4376dd-f532-418c-ad64-5d4861c2271c	2754	8	17	2026-05-13 11:01:09.764201
3caa9c2a-cbcf-4d47-8949-1a1e6a987926	1470	6	13	2026-05-13 15:04:27.438963
78079a64-de94-4d1d-8e32-e82c30d574b3	1003	5	11	2026-05-13 15:03:36.396003
4fbfad70-0d7e-4b0a-9836-97fa708177a0	636	4	9	2026-05-29 09:03:58.979875
0a70cf27-dd6e-4891-981f-a6fa185fdbed	20	1	1	2026-06-20 16:09:54.374437
5d533fb3-8bab-4e32-8a70-2fd3d523e378	10	1	0	2026-06-22 10:07:14.00427
212f41f2-9c73-4550-9baf-03116c6ce289	0	1	0	2026-06-12 09:38:25.790533
d01930fd-10cb-4705-82f3-de179a2c514f	30	1	0	2026-06-12 09:47:09.317571
29954a24-1c8a-4878-a70b-5c226a02a94b	10	1	0	2026-06-12 10:23:07.003649
3b7eda8e-0bc1-4c47-bf69-6ccebb484d4a	10	1	0	2026-06-12 10:32:37.617673
9cb5fd28-5944-4407-9ed5-a1c6522f0b42	0	1	0	2026-06-12 10:35:35.454166
63067d89-05de-4a11-9fe9-1fba5b52ea9e	60	1	3	2026-06-22 19:42:14.350891
e9a6c3ce-b579-4775-9b5b-70641dbb47cd	0	1	1	2026-06-22 19:42:26.993639
0b44b67d-63b3-4705-9464-c5f6b279866a	369	3	1	2026-06-17 15:04:16.031119
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	4610	10	1	2026-06-22 19:45:22.308116
6e77fac8-4f86-4f0f-ba81-be4e9d51c977	10	1	0	2026-06-17 21:56:36.930557
e5f739d4-47d8-43fa-bb54-dfb074511cb4	0	1	0	2026-06-17 22:02:09.751662
ae23b160-380d-4fc9-ba21-7dd6fbe04d54	0	1	0	2026-06-17 22:24:32.0706
7806ded9-937b-4975-83ea-a9336f9c9a73	10	1	0	2026-06-17 22:51:37.17842
7c142186-bdf1-4dd8-b174-5884468ae26a	2132	7	1	2026-06-22 19:57:33.494122
34e079cb-e041-4085-9a31-a0782fdd5af8	459	3	1	2026-06-22 20:02:10.78618
5a708101-a917-4e6f-bf93-0a960a638577	330	3	1	2026-06-22 20:07:00.380272
e87b1064-01b8-4369-a98f-4c16da9c91fe	45	1	0	2026-06-18 15:00:46.965074
7717dfeb-efb1-4180-a1b7-8c6fc6e90cf1	0	1	0	2026-06-19 08:06:40.681508
dac8e393-f03e-4776-a6c5-6a3fcba12943	0	1	0	2026-06-20 15:14:32.849915
\.


--
-- Data for Name: userweaknesses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.userweaknesses (id, userid, skill, errortype, errorkey, label, mistakecount, attemptcount, weight, lastseenat, updatedat) FROM stdin;
e87121a1-16a2-4c96-8426-589148f8a03f	7c142186-bdf1-4dd8-b174-5884468ae26a	listening	multiple_choice	listening_multiple_choice	Nghe hiểu	1	1	7.5	2026-05-24 14:13:07.159528	2026-05-24 14:13:07.159528
262eeb85-9b62-4034-8c43-92437b784996	7c142186-bdf1-4dd8-b174-5884468ae26a	listening	true_false	listening_true_false	Nghe hiểu	1	1	7.5	2026-05-24 14:13:07.165951	2026-05-24 14:13:07.165951
5c8546e8-7c6e-4302-9e69-ea4bedfd46d7	7c142186-bdf1-4dd8-b174-5884468ae26a	listening	fill_blank	listening_fill_blank	Nghe hiểu	1	1	7.5	2026-05-24 14:13:07.169648	2026-05-24 14:13:07.169648
7544f8d4-2c8f-4da6-9d77-41ec026bb220	7c142186-bdf1-4dd8-b174-5884468ae26a	reading	multiple_choice	reading_multiple_choice	Đọc hiểu	1	1	7.5	2026-05-24 14:14:19.939246	2026-05-24 14:14:19.939246
bacb07d1-a09e-4371-ad7e-0e57a7287fa0	7c142186-bdf1-4dd8-b174-5884468ae26a	reading	true_false	reading_true_false	Đọc hiểu	1	1	7.5	2026-05-24 14:14:19.945064	2026-05-24 14:14:19.945064
699ce5fe-044d-492f-af24-f0a9c0e81cd4	7c142186-bdf1-4dd8-b174-5884468ae26a	reading	fill_blank	reading_fill_blank	Đọc hiểu	1	1	7.5	2026-05-24 14:14:19.949143	2026-05-24 14:14:19.949143
1a65fd6c-b70f-463f-a5bf-480f9fe8e200	7c142186-bdf1-4dd8-b174-5884468ae26a	writing	writing_accuracy	cau_viet_chua_at_o_chinh_xac	Độ chính xác bài viết	1	1	7.5	2026-05-24 14:14:33.316895	2026-05-24 14:14:33.316895
23ad2a2e-d5c8-4bd6-9de2-dbdbf19ec39f	7c142186-bdf1-4dd8-b174-5884468ae26a	grammar	grammar_topic	ong_tu_khuyet_thieu_can_could_must_should_may_might	Động từ khuyết thiếu: can, could, must, should, may, might	3	3	18	2026-05-24 14:15:36.685665	2026-05-24 14:15:36.685665
bd4a9582-835b-4b62-bd3e-b0de999ca526	7c142186-bdf1-4dd8-b174-5884468ae26a	grammar	grammar_topic	gioi_tu_chi_thoi_gian_in_on_at_va_noi_chon	Giới từ chỉ thời gian (in, on, at) và nơi chốn	3	3	18	2026-05-24 14:16:11.776503	2026-05-24 14:16:11.776503
73c69be0-db54-405e-8c7a-70b79ce6efbc	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	unsportsmanlike	Nói thiếu/chưa rõ: unsportsmanlike	1	1	6	2026-05-24 21:06:43.567834	2026-05-24 21:06:43.567834
cf3a961f-220c-4297-b045-4990f6b70d65	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	foul	Nói thiếu/chưa rõ: foul	3	3	15	2026-05-24 21:07:35.468056	2026-05-24 21:07:35.468056
50ccac89-2889-489b-a4a3-16a66ca0b6f9	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	will	Nói thiếu/chưa rõ: will, defense	1	1	6	2026-05-24 21:08:27.954762	2026-05-24 21:08:27.954762
11984dc2-4007-4e9b-8fd5-9f1170f6d466	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	first	Nói thiếu/chưa rõ: first, place	1	1	6	2026-05-24 21:09:06.934481	2026-05-24 21:09:06.934481
0923a914-b476-48ae-b83d-be275ade012f	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	last	Nói thiếu/chưa rõ: last	1	1	4.5	2026-05-24 21:09:18.58304	2026-05-24 21:09:18.58304
71b165aa-b56d-420c-b2da-2a036e931691	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	we	Nói thiếu/chưa rõ: we, are, last	1	1	7.5	2026-05-24 21:09:29.979716	2026-05-24 21:09:29.979716
f613565f-59e0-41f1-8887-c693344bb53f	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	it	Nói thiếu/chưa rõ: it, is, small, old, stadium	2	2	15	2026-05-24 21:10:04.323326	2026-05-24 21:10:04.323326
85c20b90-25e1-4b8d-9595-692690d6e862	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	your	Nói thiếu/chưa rõ: your, smile	2	2	13.5	2026-05-24 21:11:31.904929	2026-05-24 21:11:31.904929
a1879f41-540c-4d9b-8fd6-c752d6849be7	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	try	Nói thiếu/chưa rõ: try, new, restaurant	3	3	19.5	2026-05-24 21:12:36.156973	2026-05-24 21:12:36.156973
8129c87a-33fe-4012-8b77-60964bfe1d9c	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	them	Nói thiếu/chưa rõ: them	1	1	4.5	2026-05-24 21:12:57.201955	2026-05-24 21:12:57.201955
79501836-5e59-4f16-970f-44be396172e4	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	go	Nói thiếu/chưa rõ: go, museum	4	4	25.5	2026-05-24 21:15:39.568283	2026-05-24 21:15:39.568283
d5090081-9faa-46d3-adf0-3d3f51ad53c3	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	i	Nói thiếu/chưa rõ: i, can	2	2	13.5	2026-05-26 16:51:27.963712	2026-05-26 16:51:27.963712
9381a3c5-9b32-4141-8cd4-343ebfb499cd	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	john	Nói thiếu/chưa rõ: john	1	1	4.5	2026-05-26 18:53:14.753071	2026-05-26 18:53:14.753071
847acccf-7518-4dc8-9188-8e9c5c0094fc	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	from	Nói thiếu/chưa rõ: from, vietnam	1	1	6	2026-05-27 20:54:46.983929	2026-05-27 20:54:46.983929
93baef31-66f2-4a37-b705-81892b6ed3c8	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	work	Nói thiếu/chưa rõ: work, as, teacher	1	1	7.5	2026-05-27 20:54:59.25639	2026-05-27 20:54:59.25639
e81e7bcd-9de8-4eca-b0ac-3e07ec46eb00	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	love	Nói thiếu/chưa rõ: love, reading	1	1	6	2026-05-27 20:55:09.474032	2026-05-27 20:55:09.474032
babcd51a-c0ae-4f39-93db-c56522cf33cb	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	reading	Nói thiếu/chưa rõ: reading	1	1	4.5	2026-05-27 20:55:18.040091	2026-05-27 20:55:18.040091
7de9e036-e575-46e7-8294-889cd0a5f8ac	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	sarah	Nói thiếu/chưa rõ: sarah	1	1	4.5	2026-05-27 23:52:10.14509	2026-05-27 23:52:10.14509
b7490b21-083a-4aa6-a130-ccd405f28b21	34e079cb-e041-4085-9a31-a0782fdd5af8	writing	grammar	su_dung_my_name_is_e_gioi_thieu_ten_va_them_am_sau_i	Ngữ pháp: Sử dụng 'my name is' để giới thiệu tên và thêm 'am' sau 'I'	1	1	4.5	2026-05-27 23:52:52.458715	2026-05-27 23:52:52.458715
7513754b-b4f1-4d93-b8bc-8da3103f5bf9	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	five	Nói thiếu/chưa rõ: five, dollars	1	1	7.5	2026-05-28 00:31:25.054016	2026-05-28 00:31:25.054016
a1dde1f9-0c7e-4bc3-954a-4de908fab78e	34e079cb-e041-4085-9a31-a0782fdd5af8	speaking	speaking_accuracy	three	Nói thiếu/chưa rõ: three, dollars	1	1	7.5	2026-05-28 00:31:36.342783	2026-05-28 00:31:36.342783
1e813c29-dac7-4c97-a710-2a7b26feeec7	4fbfad70-0d7e-4b0a-9836-97fa708177a0	listening	multiple_choice	listening_multiple_choice	Nghe hiểu	1	1	7.5	2026-05-29 09:04:42.890921	2026-05-29 09:04:42.890921
363f44a3-11cd-4461-a597-b0ca331feab7	4fbfad70-0d7e-4b0a-9836-97fa708177a0	listening	fill_blank	listening_fill_blank	Nghe hiểu	2	2	12	2026-05-29 09:05:00.326925	2026-05-29 09:05:00.326925
4a9457c9-046e-4fcb-ac89-0c40d7d48b1d	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	game	matching	game_matching	Mini game nối từ	1	1	4.5	2026-05-29 09:18:06.480764	2026-05-29 09:18:06.480764
cffd9b8a-6847-403e-b083-e41dd1b2e8e5	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	writing	writing_accuracy	cau_viet_chua_at_o_chinh_xac	Độ chính xác bài viết	1	1	7.5	2026-05-29 10:01:37.01145	2026-05-29 10:01:37.01145
f4e12e94-9225-455d-b4d6-ced2d8c83d7e	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	writing	grammar	tu_from_thuong_i_truoc_quoc_gia_con_live_in_thuong_i_sau_quoc_gia	Ngữ pháp: Từ 'from' thường đi trước quốc gia, còn 'live in' thường đi sau quốc gia.	1	1	6	2026-05-29 10:02:38.084158	2026-05-29 10:02:38.084158
41540718-5495-428b-a56c-3ff736aacef4	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	game	truefalse	game_truefalse	Mini game đúng sai	3	3	13.5	2026-05-29 10:29:15.701832	2026-05-29 10:29:15.701832
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
7c142186-bdf1-4dd8-b174-5884468ae26a	14b9ef31-c1b6-4ccf-ac0d-abba8f5a1c60	completed	100	2026-06-20 21:33:55.039541
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
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


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
-- Name: usergameprogress uq_ugp_user_level; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usergameprogress
    ADD CONSTRAINT uq_ugp_user_level UNIQUE (userid, levelid);


--
-- Name: userachievements userachievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.userachievements
    ADD CONSTRAINT userachievements_pkey PRIMARY KEY (userid, achievementid);


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
-- Name: usererrorevents usererrorevents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usererrorevents
    ADD CONSTRAINT usererrorevents_pkey PRIMARY KEY (id);


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
-- Name: userweaknesses userweaknesses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.userweaknesses
    ADD CONSTRAINT userweaknesses_pkey PRIMARY KEY (id);


--
-- Name: userweaknesses userweaknesses_userid_skill_errortype_errorkey_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.userweaknesses
    ADD CONSTRAINT userweaknesses_userid_skill_errortype_errorkey_key UNIQUE (userid, skill, errortype, errorkey);


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
-- Name: idx_user_collections_public_review; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_collections_public_review ON public.usercollections USING btree (ispublic, reviewstatus, updatedat DESC);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_email ON public.users USING btree (email);


--
-- Name: idx_user_error_events_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_error_events_reference ON public.usererrorevents USING btree (referencetype, referenceid);


--
-- Name: idx_user_error_events_user_skill; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_error_events_user_skill ON public.usererrorevents USING btree (userid, skill, createdat DESC);


--
-- Name: idx_user_weaknesses_user_weight; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_weaknesses_user_weight ON public.userweaknesses USING btree (userid, weight DESC, lastseenat DESC);


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
    ADD CONSTRAINT listeningsegments_speakerid_fkey FOREIGN KEY (speakerid) REFERENCES public.listeningspeakers(id) ON DELETE SET NULL;


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
-- Name: userachievements userachievements_achievementid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.userachievements
    ADD CONSTRAINT userachievements_achievementid_fkey FOREIGN KEY (achievementid) REFERENCES public.achievements(id);


--
-- Name: userachievements userachievements_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.userachievements
    ADD CONSTRAINT userachievements_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


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
-- Name: usererrorevents usererrorevents_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usererrorevents
    ADD CONSTRAINT usererrorevents_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


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
-- Name: userweaknesses userweaknesses_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.userweaknesses
    ADD CONSTRAINT userweaknesses_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: writingexercises writingexercises_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.writingexercises
    ADD CONSTRAINT writingexercises_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.writinglessons(id) ON DELETE CASCADE;


--
-- Name: writingvocab writingvocab_exerciseid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.writingvocab
    ADD CONSTRAINT writingvocab_exerciseid_fkey FOREIGN KEY (exerciseid) REFERENCES public.writingexercises(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict FnQ4TiPTh6JkIzbiQ2Q2lcdgbVQEQfGASLsoDWiSvKrhqDQrsn8fZUgIs6hJUxE

