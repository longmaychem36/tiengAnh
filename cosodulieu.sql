--
-- PostgreSQL database dump
--

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

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100),
    description character varying(255),
    condition character varying(255)
);


--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255),
    description text,
    levelid integer,
    createdby uuid,
    createdat timestamp without time zone DEFAULT now()
);


--
-- Name: dictionaryentries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dictionaryentries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    word character varying(100) NOT NULL,
    phonetic character varying(100),
    partofspeech character varying(50),
    meaningen text,
    meaningvi text,
    example text,
    audiourl character varying(255),
    levelid integer
);


--
-- Name: dictionarysearchhistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dictionarysearchhistory (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid,
    word character varying(100),
    searchedat timestamp without time zone DEFAULT now()
);


--
-- Name: dictionarysynonyms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dictionarysynonyms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    wordid uuid,
    synonym character varying(100)
);


--
-- Name: gamelevels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gamelevels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    setid uuid NOT NULL,
    levelnumber integer NOT NULL,
    name character varying(200),
    difficulty character varying(20) DEFAULT 'easy'::character varying,
    timelimit integer DEFAULT 60,
    passscore integer DEFAULT 70,
    islocked boolean DEFAULT false,
    createdat timestamp without time zone DEFAULT now()
);


--
-- Name: gamesets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gamesets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(200) NOT NULL,
    description character varying(500),
    gametype character varying(50) NOT NULL,
    icon character varying(10) DEFAULT '🎮'::character varying,
    orderindex integer DEFAULT 0,
    unlockcondition character varying(200) DEFAULT 'none'::character varying,
    createdat timestamp without time zone DEFAULT now()
);


--
-- Name: grammarcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grammarcategories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    namevi character varying(100),
    icon character varying(10) DEFAULT '📘'::character varying,
    orderindex integer DEFAULT 0
);


--
-- Name: grammarcategories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grammarcategories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grammarcategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grammarcategories_id_seq OWNED BY public.grammarcategories.id;


--
-- Name: grammarquiz; Type: TABLE; Schema: public; Owner: postgres
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
-- Name: grammartopics; Type: TABLE; Schema: public; Owner: postgres
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
-- Name: learninglevels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.learninglevels (
    id integer NOT NULL,
    code character varying(20),
    name character varying(100),
    description character varying(255)
);


--
-- Name: learninglevels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.learninglevels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: learninglevels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.learninglevels_id_seq OWNED BY public.learninglevels.id;


--
-- Name: lessonmedia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessonmedia (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid,
    mediatype character varying(20),
    mediaurl character varying(255),
    description character varying(255)
);


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    courseid uuid,
    title character varying(255),
    content text,
    type character varying(20),
    levelid integer,
    orderindex integer
);


--
-- Name: lessonvocabulary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessonvocabulary (
    lessonid uuid NOT NULL,
    vocabid uuid NOT NULL
);


--
-- Name: minigamequestions; Type: TABLE; Schema: public; Owner: postgres
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
-- Name: quiz; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid,
    question text,
    type character varying(50),
    correctanswer character varying(255)
);


--
-- Name: quizoptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quizoptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quizid uuid,
    optiontext character varying(255)
);


--
-- Name: speakinglessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.speakinglessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255),
    description text,
    orderindex integer DEFAULT 0,
    createdat timestamp without time zone DEFAULT now()
);


--
-- Name: speakingprogress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.speakingprogress (
    userid uuid NOT NULL,
    lessonid uuid NOT NULL,
    status character varying(50) DEFAULT 'in_progress'::character varying,
    score double precision DEFAULT 0,
    updatedat timestamp without time zone DEFAULT now()
);


--
-- Name: speakingquestions; Type: TABLE; Schema: public; Owner: postgres
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
-- Name: userachievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userachievements (
    userid uuid NOT NULL,
    achievementid uuid NOT NULL,
    unlockedat timestamp without time zone DEFAULT now()
);


--
-- Name: usercollections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usercollections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    createdat timestamp without time zone DEFAULT now()
);


--
-- Name: usercollectionwords; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usercollectionwords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    collectionid uuid NOT NULL,
    dictionaryentryid uuid,
    customword character varying(255),
    custommeaning text,
    customexample text,
    addedat timestamp without time zone DEFAULT now()
);


--
-- Name: usergameprogress; Type: TABLE; Schema: public; Owner: postgres
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
-- Name: userprogress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userprogress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid,
    lessonid uuid,
    status character varying(20),
    score integer
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
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
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying, 'superadmin'::character varying])::text[])))
);


--
-- Name: userstats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userstats (
    userid uuid NOT NULL,
    exp integer DEFAULT 0,
    level integer DEFAULT 1,
    streakdays integer DEFAULT 0,
    lastlogin timestamp without time zone
);


--
-- Name: uservocabulary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uservocabulary (
    userid uuid NOT NULL,
    vocabid uuid NOT NULL,
    status character varying(20)
);


--
-- Name: vocabulary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vocabulary (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    word character varying(100),
    meaning text,
    example text,
    audiourl character varying(255),
    imageurl character varying(255)
);


--
-- Name: writingexercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.writingexercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid,
    contentvi text,
    correctansweren text,
    orderindex integer
);


--
-- Name: writinglessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.writinglessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255),
    description text,
    orderindex integer,
    createdat timestamp without time zone DEFAULT now()
);


--
-- Name: writingprogress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.writingprogress (
    userid uuid NOT NULL,
    lessonid uuid NOT NULL,
    status character varying(50),
    score double precision,
    updatedat timestamp without time zone DEFAULT now()
);


--
-- Name: writingvocab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.writingvocab (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    exerciseid uuid,
    word character varying(100),
    meaning character varying(255)
);


--
-- Name: grammarcategories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grammarcategories ALTER COLUMN id SET DEFAULT nextval('public.grammarcategories_id_seq'::regclass);


--
-- Name: learninglevels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.learninglevels ALTER COLUMN id SET DEFAULT nextval('public.learninglevels_id_seq'::regclass);


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.achievements (id, name, description, condition) FROM stdin;
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, title, description, levelid, createdby, createdat) FROM stdin;
\.


--
-- Data for Name: dictionaryentries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dictionaryentries (id, word, phonetic, partofspeech, meaningen, meaningvi, example, audiourl, levelid) FROM stdin;
2853a413-54d0-488c-a8c2-1bebf8471cd9	hi	haɪ	noun	[{"partOfSpeech":"noun","definition":"The word \\"hi\\" used as a greeting.","example":"I didn't even get a hi."},{"partOfSpeech":"interjection","definition":"A friendly, informal, casual greeting said when meeting someone.","example":"Hi, how are you?"},{"partOfSpeech":"interjection","definition":"An exclamation to call attention.","example":""},{"partOfSpeech":"interjection","definition":"Expressing wonder or derision.","example":""}]	xin chào; CHÀO; SET 1	\N	{"uk":"https://api.dictionaryapi.dev/media/pronunciations/en/hi-1-uk.mp3","us":"https://api.dictionaryapi.dev/media/pronunciations/en/hi-1-us.mp3"}	\N
a693c75e-ad37-4e20-bce8-cc93144884b3	high	haɪ	noun	[{"partOfSpeech":"noun","definition":"A high point or position, literally or figuratively; an elevated place; a superior region; a height; the sky; heaven.","example":""},{"partOfSpeech":"noun","definition":"A point of success or achievement; a time when things are at their best.","example":"It was one of the highs of his career."},{"partOfSpeech":"noun","definition":"A period of euphoria, from excitement or from an intake of drugs.","example":"That pill gave me a high for a few hours, before I had a comedown."},{"partOfSpeech":"noun","definition":"A drug that gives such a high.","example":""},{"partOfSpeech":"noun","definition":"A large area of elevated atmospheric pressure; an anticyclone.","example":"A large high is centred on the Azores."},{"partOfSpeech":"noun","definition":"The maximum value attained by some quantity within a specified period.","example":"Inflation reached a ten-year high."},{"partOfSpeech":"noun","definition":"The maximum atmospheric temperature recorded at a particular location, especially during one 24-hour period.","example":"Today's high was 32°C."},{"partOfSpeech":"noun","definition":"The highest card dealt or drawn.","example":""},{"partOfSpeech":"verb","definition":"To rise.","example":"The sun higheth."},{"partOfSpeech":"adjective","definition":"Very elevated; extending or being far above a base; tall; lofty.","example":"The balloon rose high in the sky.   The wall was high.   a high mountain"},{"partOfSpeech":"adjective","definition":"Relatively elevated; rising or raised above the average or normal level from which elevation is measured.","example":""},{"partOfSpeech":"adjective","definition":"Having a specified elevation or height; tall.","example":"three feet high   three Mount Everests high"},{"partOfSpeech":"adjective","definition":"Elevated in status, esteem, prestige; exalted in rank, station, or character.","example":"The oldest of the elves' royal family still conversed in High Elvish."},{"partOfSpeech":"adjective","definition":"Of great importance and consequence: grave (if negative) or solemn (if positive).","example":"high crimes, the high festival of the sun"},{"partOfSpeech":"adjective","definition":"Consummate; advanced (e.g. in development) to the utmost extent or culmination, or possessing a quality in its supreme degree, at its zenith.","example":"high (i.e. intense) heat; high (i.e. full or quite) noon; high (i.e. rich or spicy) seasoning; high (i.e. complete) pleasure; high (i.e. deep or vivid) colour; high (i.e. extensive, thorough) scholarship; high tide; high [tourism] season; the High Middle Ages"},{"partOfSpeech":"adjective","definition":"(in several set phrases) Remote in distance or time.","example":"high latitude, high antiquity"},{"partOfSpeech":"adjective","definition":"(in several set phrases) Very traditionalist and conservative, especially in favoring older ways of doing things; see e.g. high church, High Tory.","example":""},{"partOfSpeech":"adjective","definition":"Elevated in mood; marked by great merriment, excitement, etc.","example":"in high spirits"},{"partOfSpeech":"adjective","definition":"(of a lifestyle) Luxurious; rich.","example":"high living, the high life"},{"partOfSpeech":"adjective","definition":"Lofty, often to the point of arrogant, haughty, boastful, proud.","example":"a high tone"},{"partOfSpeech":"adjective","definition":"(with \\"on\\" or \\"about\\") Keen, enthused.","example":""},{"partOfSpeech":"adjective","definition":"(of a body of water) With tall waves.","example":""},{"partOfSpeech":"adjective","definition":"Large, great (in amount or quantity, value, force, energy, etc).","example":"My bank charges me a high interest rate.   I was running a high temperature and had high cholesterol.   high voltage   high prices   high winds   a high number"},{"partOfSpeech":"adjective","definition":"(acoustics) Acute or shrill in pitch, due to being of greater frequency, i.e. produced by more rapid vibrations (wave oscillations).","example":"The note was too high for her to sing."},{"partOfSpeech":"adjective","definition":"Made with some part of the tongue positioned high in the mouth, relatively close to the palate.","example":""},{"partOfSpeech":"adjective","definition":"Greater in value than other cards, denominations, suits, etc.","example":""},{"partOfSpeech":"adjective","definition":"(of meat, especially venison) Strong-scented; slightly tainted/spoiled; beginning to decompose.","example":"Epicures do not cook game before it is high."},{"partOfSpeech":"adjective","definition":"Intoxicated; under the influence of a mood-altering drug, formerly usually alcohol, but now (from the mid-20th century) usually not alcohol but rather marijuana, cocaine, heroin, etc.","example":""},{"partOfSpeech":"adjective","definition":"(of a sailing ship) Near, in its direction of travel, to the (direction of the) wind.","example":""},{"partOfSpeech":"adverb","definition":"In or to an elevated position.","example":"How high above land did you fly?"},{"partOfSpeech":"adverb","definition":"In or at a great value.","example":"Costs have grown higher this year again."},{"partOfSpeech":"adverb","definition":"At a pitch of great frequency.","example":"I certainly can't sing that high."}]	cao; Cao	\N	{"uk":"https://api.dictionaryapi.dev/media/pronunciations/en/high-uk.mp3","us":"https://api.dictionaryapi.dev/media/pronunciations/en/high-us.mp3"}	\N
935b9e8a-cd6c-495e-b6ba-503fa04b77d4	apple	ˈæp.əl	noun	[{"partOfSpeech":"noun","definition":"A common, round fruit produced by the tree Malus domestica, cultivated in temperate climates.","example":""},{"partOfSpeech":"noun","definition":"Any of various tree-borne fruits or vegetables especially considered as resembling an apple; also (with qualifying words) used to form the names of other specific fruits such as custard apple, rose apple, thorn apple etc.","example":""},{"partOfSpeech":"noun","definition":"The fruit of the Tree of Knowledge, eaten by Adam and Eve according to post-Biblical Christian tradition; the forbidden fruit.","example":""},{"partOfSpeech":"noun","definition":"A tree of the genus Malus, especially one cultivated for its edible fruit; the apple tree.","example":""},{"partOfSpeech":"noun","definition":"The wood of the apple tree.","example":""},{"partOfSpeech":"noun","definition":"(in the plural) Short for apples and pears, slang for stairs.","example":""},{"partOfSpeech":"noun","definition":"The ball in baseball.","example":""},{"partOfSpeech":"noun","definition":"When smiling, the round, fleshy part of the cheeks between the eyes and the corners of the mouth.","example":""},{"partOfSpeech":"noun","definition":"A Native American or red-skinned person who acts and/or thinks like a white (Caucasian) person.","example":""},{"partOfSpeech":"noun","definition":"(ice hockey slang) An assist.","example":""},{"partOfSpeech":"verb","definition":"To become apple-like.","example":""},{"partOfSpeech":"verb","definition":"To form buds.","example":""}]	táo; táo tây; quả táo	\N	{"uk":"https://api.dictionaryapi.dev/media/pronunciations/en/apple-uk.mp3","us":"https://api.dictionaryapi.dev/media/pronunciations/en/apple-us.mp3"}	\N
79e6a4b1-7d7d-47fc-a0f9-67c66290f353	applet	\N	noun	[{"partOfSpeech":"noun","definition":"A small program module that runs under the control of a larger application, typically a web browser","example":""}]	Má» báº±ng & MozillaComment	\N	{"uk":"","us":""}	\N
6100ff96-feda-4e6e-a80e-0967473afe25	appleton layer	\N	\N	\N	lớp táo	\N	\N	\N
e90c6c0c-5f8e-4b26-9f17-43b322212ad6	test	test	noun	[{"partOfSpeech":"noun","definition":"A challenge, trial.","example":""},{"partOfSpeech":"noun","definition":"A cupel or cupelling hearth in which precious metals are melted for trial and refinement.","example":""},{"partOfSpeech":"noun","definition":"(academia) An examination, given often during the academic term.","example":""},{"partOfSpeech":"noun","definition":"A session in which a product or piece of equipment is examined under everyday or extreme conditions to evaluate its durability, etc.","example":""},{"partOfSpeech":"noun","definition":"(normally “Test”) A Test match.","example":""},{"partOfSpeech":"noun","definition":"The external calciferous shell, or endoskeleton, of an echinoderm, e.g. sand dollars and sea urchins.","example":""},{"partOfSpeech":"noun","definition":"Testa; seed coat.","example":""},{"partOfSpeech":"noun","definition":"Judgment; distinction; discrimination.","example":""},{"partOfSpeech":"verb","definition":"To challenge.","example":"Climbing the mountain tested our stamina."},{"partOfSpeech":"verb","definition":"To refine (gold, silver, etc.) in a test or cupel; to subject to cupellation.","example":""},{"partOfSpeech":"verb","definition":"To put to the proof; to prove the truth, genuineness, or quality of by experiment, or by some principle or standard; to try.","example":"to test the soundness of a principle; to test the validity of an argument"},{"partOfSpeech":"verb","definition":"(academics) To administer or assign an examination, often given during the academic term, to (somebody).","example":""},{"partOfSpeech":"verb","definition":"To place a product or piece of equipment under everyday and/or extreme conditions and examine it for its durability, etc.","example":""},{"partOfSpeech":"verb","definition":"To be shown to be by test.","example":"He tested positive for cancer."},{"partOfSpeech":"verb","definition":"To examine or try, as by the use of some reagent.","example":"to test a solution by litmus paper"}]	tiếng Anh; Bài kiểm tra; Phép thử	\N	{"uk":"https://api.dictionaryapi.dev/media/pronunciations/en/test-uk.mp3","us":"https://api.dictionaryapi.dev/media/pronunciations/en/test-us.mp3"}	\N
4a65e13d-ba32-431f-8a99-fe1527aed8e8	hello	həˈləʊ	noun	[{"partOfSpeech":"noun","definition":"\\"Hello!\\" or an equivalent greeting.","example":""},{"partOfSpeech":"verb","definition":"To greet with \\"hello\\".","example":""},{"partOfSpeech":"interjection","definition":"A greeting (salutation) said when meeting someone or acknowledging someone’s arrival or presence.","example":"Hello, everyone."},{"partOfSpeech":"interjection","definition":"A greeting used when answering the telephone.","example":"Hello? How may I help you?"},{"partOfSpeech":"interjection","definition":"A call for response if it is not clear if anyone is present or listening, or if a telephone conversation may have been disconnected.","example":"Hello? Is anyone there?"},{"partOfSpeech":"interjection","definition":"Used sarcastically to imply that the person addressed or referred to has done something the speaker or writer considers to be foolish.","example":"You just tried to start your car with your cell phone. Hello?"},{"partOfSpeech":"interjection","definition":"An expression of puzzlement or discovery.","example":"Hello! What’s going on here?"}]	xin chào; [object HTMLTextAreaElement]; Xin chào	\N	{"uk":"https://api.dictionaryapi.dev/media/pronunciations/en/hello-uk.mp3","us":"https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3"}	\N
38bc40f2-9fa8-408d-9d8f-71ba4adce687	greeting	ˈɡɹiːtɪŋ	verb	[{"partOfSpeech":"verb","definition":"To welcome in a friendly manner, either in person or through another means e.g. writing or over the phone/internet","example":""},{"partOfSpeech":"verb","definition":"To arrive at or reach, or meet (talking of something which brings joy)","example":""},{"partOfSpeech":"verb","definition":"To accost; to address.","example":""},{"partOfSpeech":"verb","definition":"To meet and give salutations.","example":""},{"partOfSpeech":"verb","definition":"To be perceived by (somebody).","example":"A brilliant dawn greeted her eyes as she looked out of the window."},{"partOfSpeech":"verb","definition":"To weep; to cry.","example":""},{"partOfSpeech":"noun","definition":"A conventional phrase used to start a letter or conversation or otherwise to acknowledge a person's arrival or presence.","example":"It's polite to begin a letter with a greeting, but this practice is less common in email."},{"partOfSpeech":"noun","definition":"The action of the verb to greet.","example":""}]	Lời chào ; - Chào hỏi; Lời chào:	\N	{"uk":"","us":""}	\N
a22a5eae-49a5-44c3-8444-00961892514e	quit	kwɪt	verb	[{"partOfSpeech":"verb","definition":"To pay (a debt, fine etc.).","example":""},{"partOfSpeech":"verb","definition":"To repay (someone) for (something).","example":""},{"partOfSpeech":"verb","definition":"To repay, pay back (a good deed, injury etc.).","example":""},{"partOfSpeech":"verb","definition":"To conduct or acquit (oneself); to behave (in a specified way).","example":""},{"partOfSpeech":"verb","definition":"To carry through; to go through to the end.","example":""},{"partOfSpeech":"verb","definition":"To set at rest; to free, as from anything harmful or oppressive; to relieve; to clear; to liberate.","example":""},{"partOfSpeech":"verb","definition":"To release from obligation, accusation, penalty, etc.; to absolve; to acquit.","example":""},{"partOfSpeech":"verb","definition":"To abandon, renounce (a thing).","example":""},{"partOfSpeech":"verb","definition":"To leave (a place).","example":""},{"partOfSpeech":"verb","definition":"To resign from (a job, office, position, etc.).","example":"After having to work overtime without being paid, I quit my job."},{"partOfSpeech":"verb","definition":"To stop, give up (an activity) (usually + gerund or verbal noun).","example":"John is planning to quit smoking."},{"partOfSpeech":"verb","definition":"To close (an application).","example":""},{"partOfSpeech":"adjective","definition":"(usually followed by of) Released from obligation, penalty, etc; free, clear, or rid.","example":""}]	thoát, thoát ra; từ bỏ; Bỏ việc	\N	{"uk":"","us":"https://api.dictionaryapi.dev/media/pronunciations/en/quit-us.mp3"}	\N
f1a45c46-aa79-4fbb-83b3-ce18796a17be	quite	kwaɪt	adverb	[{"partOfSpeech":"adverb","definition":"(heading) To the greatest extent or degree; completely, entirely.","example":""},{"partOfSpeech":"adverb","definition":"(heading) In a fully justified sense; truly, perfectly, actually.","example":""},{"partOfSpeech":"adverb","definition":"To a moderate extent or degree; somewhat, rather.","example":""},{"partOfSpeech":"interjection","definition":"Indicates agreement; \\"exactly so\\".","example":""}]	hoàn toàn, hầu hết; khá; Chính xác	\N	{"uk":"","us":"https://api.dictionaryapi.dev/media/pronunciations/en/quite-1-us.mp3"}	\N
ebd37a02-7319-4bf0-a4cd-8151fd4c3f33	absolutely	æb.səˈl(j)uːt.lɪ	adverb	[{"partOfSpeech":"adverb","definition":"In an absolute or unconditional manner; utterly, positively, wholly.","example":""},{"partOfSpeech":"adverb","definition":"Independently; viewed without relation to other things or factors.","example":""},{"partOfSpeech":"adverb","definition":"(grammar) In a manner that does not take an object.","example":""},{"partOfSpeech":"interjection","definition":"Yes; certainly; expression indicating strong agreement.","example":"Do you want a free cookie with that coffee?\\nAbsolutely!"}]	hoàn toàn; tuyệt đối; I wish you	\N	{"uk":"","us":"https://api.dictionaryapi.dev/media/pronunciations/en/absolutely-us.mp3"}	\N
eb987180-6608-48d5-a6b3-40c70d2b20cf	girl	ɡɵːl	noun	[{"partOfSpeech":"noun","definition":"A female child, adolescent, or a young woman.","example":""},{"partOfSpeech":"noun","definition":"A young female animal.","example":""},{"partOfSpeech":"noun","definition":"(sometimes offensive) A woman, especially a young woman","example":""},{"partOfSpeech":"noun","definition":"A female servant; a maid. (see usage notes)","example":""},{"partOfSpeech":"noun","definition":"A queen (the playing card.)","example":""},{"partOfSpeech":"noun","definition":"A term of endearment. (see usage notes)","example":""},{"partOfSpeech":"noun","definition":"One's girlfriend.","example":""},{"partOfSpeech":"noun","definition":"One's daughter.","example":"Your girl turned up on our doorstep."},{"partOfSpeech":"noun","definition":"A roebuck two years old.","example":""},{"partOfSpeech":"noun","definition":"Cocaine, especially in powder form.","example":""},{"partOfSpeech":"noun","definition":"(somewhat childish) A female (tree, gene, etc).","example":""},{"partOfSpeech":"noun","definition":"A boy or man who is weak or sentimental.","example":"Don't be such a girl!"},{"partOfSpeech":"verb","definition":"To feminize or girlify; to gender as a girl or as for girls.","example":""},{"partOfSpeech":"verb","definition":"(somewhat informal) To staff with or as a girl or girls.","example":""}]	con gái; Bạn là con gái hay con trai	\N	{"uk":"","us":"https://api.dictionaryapi.dev/media/pronunciations/en/girl-us.mp3"}	\N
38d46729-b11b-4855-b247-b0949f1dbd00	playing	ˈpleɪ.ɪŋ	verb	[{"partOfSpeech":"verb","definition":"To act in a manner such that one has fun; to engage in activities expressly for the purpose of recreation or entertainment.","example":"They played long and hard."},{"partOfSpeech":"verb","definition":"To perform in (a sport); to participate in (a game).","example":"He plays on three teams"},{"partOfSpeech":"verb","definition":"To take part in amorous activity; to make love.","example":""},{"partOfSpeech":"verb","definition":"To act as the indicated role, especially in a performance.","example":"He plays the King, and she's the Queen."},{"partOfSpeech":"verb","definition":"(heading) To produce music or theatre.","example":""},{"partOfSpeech":"verb","definition":"(heading) To behave in a particular way.","example":""},{"partOfSpeech":"verb","definition":"To move in any manner; especially, to move regularly with alternate or reciprocating motion; to operate.","example":"He played the torch beam around the room."},{"partOfSpeech":"verb","definition":"To move to and fro.","example":""},{"partOfSpeech":"verb","definition":"To put in action or motion.","example":"to play a trump in a card game"},{"partOfSpeech":"verb","definition":"To keep in play, as a hooked fish in order to land it.","example":""},{"partOfSpeech":"verb","definition":"To manipulate, deceive, or swindle someone.","example":"You played me!"},{"partOfSpeech":"noun","definition":"(gerund of play) An occasion on which something, such as a song or show, is played.","example":""}]	chơi; Đang chơi; thuong	\N	{"uk":"","us":"https://api.dictionaryapi.dev/media/pronunciations/en/playing-us.mp3"}	\N
ab96ed8e-c597-4b8a-a2fc-9930972db7f7	playing card	\N	noun	[{"partOfSpeech":"noun","definition":"Any of the usually 52 rectangular pieces of card used to play numerous games, featuring either one to 10 pips or a picture and belonging of one of four suits.","example":""}]	Bộ bài Tây; chơi bài; Đang phát	\N	{"uk":"","us":""}	\N
e69cc80f-a6aa-4d7a-8e6c-ffdead292e36	inter	ɪnˈtɜː(ɹ)	verb	[{"partOfSpeech":"verb","definition":"To bury in a grave.","example":""},{"partOfSpeech":"verb","definition":"To confine, as in a prison.","example":""}]	Inter.	\N	{"uk":"","us":""}	\N
b78b450d-9379-4ce4-9a0a-b0ad86c41a62	usualy	\N	\N	\N	bình thường	\N	\N	\N
f6c5ec10-2aaf-4b9b-9a6c-bf1ac5db658c	usual suspects	\N	\N	\N	Vẫn những nghi phạm đấy.	\N	\N	\N
e841eb10-0b6a-4587-bbde-9063f2eeda24	wild	waɪld	noun	[{"partOfSpeech":"noun","definition":"The undomesticated state of a wild animal","example":"After mending the lion's leg, we returned him to the wild."},{"partOfSpeech":"noun","definition":"(chiefly in the plural) a wilderness","example":""},{"partOfSpeech":"verb","definition":"To commit random acts of assault, robbery, and rape in an urban setting, especially as a gang.","example":""},{"partOfSpeech":"adjective","definition":"Untamed; not domesticated; specifically, in an unbroken line of undomesticated animals (as opposed to feral, referring to undomesticated animals whose ancestors were domesticated).","example":"Przewalski's horses are the only remaining wild horses."},{"partOfSpeech":"adjective","definition":"From or relating to wild creatures.","example":"wild honey"},{"partOfSpeech":"adjective","definition":"Unrestrained or uninhibited.","example":"I was filled with wild rage when I discovered the infidelity, and punched a hole in the wall."},{"partOfSpeech":"adjective","definition":"Raucous, unruly, or licentious.","example":"The fraternity was infamous for its wild parties, which frequently resulted in police involvement."},{"partOfSpeech":"adjective","definition":"Visibly and overtly anxious; frantic.","example":"Her mother was wild with fear when she didn't return home after the party."},{"partOfSpeech":"adjective","definition":"Disheveled, tangled, or untidy.","example":"After a week on the trail without a mirror, my hair was wild and dirty."},{"partOfSpeech":"adjective","definition":"Enthusiastic.","example":"I'm not wild about the idea of a two day car trip with my nephews, but it's my only option."},{"partOfSpeech":"adjective","definition":"Inaccurate.","example":"The novice archer fired a wild shot and hit her opponent's target."},{"partOfSpeech":"adjective","definition":"Exposed to the wind and sea; unsheltered.","example":"a wild roadstead"},{"partOfSpeech":"adjective","definition":"Hard to steer; said of a vessel.","example":""},{"partOfSpeech":"adjective","definition":"(of a knot) Not capable of being represented as a finite closed polygonal chain.","example":""},{"partOfSpeech":"adjective","definition":"Amazing, awesome, unbelievable.","example":"Did you hear? Pat won the lottery! - Wow, that's wild!"},{"partOfSpeech":"adjective","definition":"Able to stand in for others, e.g. a card in games, or a text character in computer pattern matching.","example":"In this card game, aces are wild: they can take the place of any other card."},{"partOfSpeech":"adverb","definition":"Inaccurately; not on target.","example":"The javelin flew wild and struck a spectator, to the horror of all observing."}]	dại, hoang; hoang dã; HOANG DÃ	\N	{"uk":"","us":"https://api.dictionaryapi.dev/media/pronunciations/en/wild-us.mp3"}	\N
c431cc1a-077f-44ed-b733-25762d37c142	animal	ˈænɪməl	noun	[{"partOfSpeech":"noun","definition":"In scientific usage, a multicellular organism that is usually mobile, whose cells are not encased in a rigid cell wall (distinguishing it from plants and fungi) and which derives energy solely from the consumption of other organisms (distinguishing it from plants).","example":"A cat is an animal, not a plant. Humans are also animals, under the scientific definition, as we are not plants."},{"partOfSpeech":"noun","definition":"In non-scientific usage, any member of the kingdom Animalia other than a human.","example":""},{"partOfSpeech":"noun","definition":"In non-scientific usage, any land-living vertebrate (i.e. not fishes, insects, etc.).","example":""},{"partOfSpeech":"noun","definition":"A person who behaves wildly; a bestial, brutal, brutish, cruel, or inhuman person.","example":"My students are animals."},{"partOfSpeech":"noun","definition":"A person of a particular type.","example":"He's a political animal."},{"partOfSpeech":"noun","definition":"Matter, thing.","example":"a whole different animal"}]	động vật, thủ vật; động vật	\N	{"uk":"","us":"https://api.dictionaryapi.dev/media/pronunciations/en/animal-us.mp3"}	\N
63a6d2ed-a913-40f2-b435-974fa3913b14	person	ˈpɜːsən	noun	[{"partOfSpeech":"noun","definition":"An individual; usually a human being.","example":"Each person is unique, both mentally and physically."},{"partOfSpeech":"noun","definition":"The physical body of a being seen as distinct from the mind, character, etc.","example":""},{"partOfSpeech":"noun","definition":"Any individual or formal organization with standing before the courts.","example":"At common law a corporation or a trust is legally a person."},{"partOfSpeech":"noun","definition":"The human genitalia; specifically, the penis.","example":""},{"partOfSpeech":"noun","definition":"(grammar) A linguistic category used to distinguish between the speaker of an utterance and those to whom or about whom he or she is speaking. See grammatical person.","example":""},{"partOfSpeech":"noun","definition":"A shoot or bud of a plant; a polyp or zooid of the compound Hydrozoa, Anthozoa, etc.; also, an individual, in the narrowest sense, among the higher animals.","example":""},{"partOfSpeech":"verb","definition":"To represent as a person; to personify; to impersonate.","example":""},{"partOfSpeech":"verb","definition":"(gender-neutral) To man.","example":""}]	pháp nhân; người	\N	{"uk":"https://api.dictionaryapi.dev/media/pronunciations/en/person-uk.mp3","us":"https://api.dictionaryapi.dev/media/pronunciations/en/person-us.mp3"}	\N
93a93092-b0b3-4abc-bd02-55ced0164682	persona	pə(ɹ)ˈsəʊnə	noun	[{"partOfSpeech":"noun","definition":"A social role.","example":""},{"partOfSpeech":"noun","definition":"A character played by an actor.","example":""},{"partOfSpeech":"noun","definition":"The mask or appearance one presents to the world.","example":""},{"partOfSpeech":"noun","definition":"(user experience) An imaginary person representing a particular type of client or customer, considered when designing products and services that will appeal to them.","example":""}]	Mặt nạ	\N	{"uk":"","us":""}	\N
\.


--
-- Data for Name: dictionarysearchhistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dictionarysearchhistory (id, userid, word, searchedat) FROM stdin;
4036538a-4de0-4079-a83f-af225b6e0544	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	hi	2026-05-11 10:38:04.200522
d4f4f620-d5a5-4632-8164-8b09073496e3	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	high	2026-05-11 10:38:04.704881
8346326e-743f-4d5d-b4fe-c58a4fd4a3c9	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	apple	2026-05-11 10:38:12.697551
43913970-d616-48e0-ba04-899afe07f578	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	applet	2026-05-11 10:38:22.783137
c639449b-4918-4ba5-9c48-caf8cdf246e8	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	appleton	2026-05-11 10:38:24.175937
96ea4673-de04-4447-a734-5491f17f342c	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	appleton layer	2026-05-11 10:38:27.632424
cd0f7fa7-8028-4049-a060-f62644e20e58	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	hello	2026-05-11 10:51:42.811171
a2b53daf-a7c8-406e-9145-090158e656d4	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	greeting	2026-05-11 10:51:46.978039
7598e134-b1cb-4c97-96ab-5dbd48afbd8c	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	apple	2026-05-11 10:52:22.703815
d2c76509-a2e5-457f-ba21-1203f56f8fc2	22227f57-0aa9-4da0-b6ac-cfd00110b514	test	2026-05-11 10:58:32.914982
8e7be368-8d7d-44dc-bbac-8f7e52a4b312	22227f57-0aa9-4da0-b6ac-cfd00110b514	test	2026-05-11 10:59:16.119952
b6ee8dcf-1a85-4e86-8804-00d3a4b99c5e	22227f57-0aa9-4da0-b6ac-cfd00110b514	hello	2026-05-11 11:01:55.323961
65ac7bb1-ddca-40f5-9141-bd18f964efbb	22227f57-0aa9-4da0-b6ac-cfd00110b514	hello	2026-05-11 11:03:44.738376
46a5656c-e269-41d2-adb3-2a985f592ef1	22227f57-0aa9-4da0-b6ac-cfd00110b514	hello	2026-05-11 11:07:29.529412
888f7806-9056-4613-958d-328e7f9f2e94	22227f57-0aa9-4da0-b6ac-cfd00110b514	quit	2026-05-11 11:07:52.657279
83b2b936-e9ff-40be-b6ad-71e9dbd74598	22227f57-0aa9-4da0-b6ac-cfd00110b514	quite	2026-05-11 11:07:53.82812
c6ba2d91-234a-48bf-91e5-9db2b4c0ada8	22227f57-0aa9-4da0-b6ac-cfd00110b514	absolutely	2026-05-11 11:08:03.136204
aab800aa-4ba2-4bd9-a1cc-ca5cfe78cd1e	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	hello	2026-05-11 11:56:38.327081
9d222ad6-5b62-4540-9d92-9bbffd380e92	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	girl	2026-05-11 11:56:45.808955
dbb2b6ef-1ca6-413a-aee7-b207e427196b	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	playing	2026-05-11 11:57:03.60619
c113d1af-2a66-41b5-9394-196d898da70e	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	playing card	2026-05-11 11:57:05.805677
fa167cdb-b56b-4666-93ee-33575d4bb09a	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	inter	2026-05-11 11:57:23.045928
f9ede83c-18c1-49b6-b8fc-7166f094bb91	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	usua	2026-05-11 11:57:29.105134
4249910c-3be4-4e82-9d71-eee1484ab913	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	usualy	2026-05-11 11:57:29.457131
75ff688b-74a9-4f96-a242-fa5b108b55d0	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	usual suspects	2026-05-11 11:57:31.892043
a03332fe-cdf5-4626-95d9-5ee54d1e6734	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	wild	2026-05-11 11:57:47.7608
f66b8005-e2d2-44d6-bc8d-640afd25004e	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	animal	2026-05-11 11:58:12.130224
9445e98f-5c4a-4f52-8ded-da512a6e6efe	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	person	2026-05-11 11:58:37.336523
3ad47281-4cbf-474d-9157-fb6897290fe8	f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	persona	2026-05-11 11:58:38.444112
\.


--
-- Data for Name: dictionarysynonyms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dictionarysynonyms (id, wordid, synonym) FROM stdin;
2e43349e-ab0d-4239-86bd-405318822d51	2853a413-54d0-488c-a8c2-1bebf8471cd9	greeting
ad948b9e-77da-4a4d-a728-36f79e7b9fef	2853a413-54d0-488c-a8c2-1bebf8471cd9	hello
38b29a86-144e-46c6-ab5e-d95dddb4bc93	2853a413-54d0-488c-a8c2-1bebf8471cd9	greetings
db1814f8-03d6-4dc8-9e38-41fcdd4ba241	e90c6c0c-5f8e-4b26-9f17-43b322212ad6	examination
01d925b2-bfe3-4bda-b69d-5f3b328b585c	e90c6c0c-5f8e-4b26-9f17-43b322212ad6	quiz
73896f59-76c3-448e-98d0-d1e71ddd0e5c	4a65e13d-ba32-431f-8a99-fe1527aed8e8	greeting
3f9e1207-f045-4e39-84d0-50265030d60b	f1a45c46-aa79-4fbb-83b3-ce18796a17be	absolutely
4168653c-81ef-42f6-8241-96d9630cff6b	f1a45c46-aa79-4fbb-83b3-ce18796a17be	fully
cc382e87-c78f-469e-8cef-2c78b9f078a5	f1a45c46-aa79-4fbb-83b3-ce18796a17be	thoroughly
2c4e893b-0318-4d96-a0d6-c0665afee480	f1a45c46-aa79-4fbb-83b3-ce18796a17be	totally
d26a22a9-b474-40a7-ba27-29b7a384c4c9	f1a45c46-aa79-4fbb-83b3-ce18796a17be	utterly
a8347388-bb99-475c-8157-54f5339592d9	eb987180-6608-48d5-a6b3-40c70d2b20cf	daughter
32df2fff-1e1f-47e6-8b2a-554056dc163a	eb987180-6608-48d5-a6b3-40c70d2b20cf	girlie
8da584b2-e891-48b4-87f4-cb4b2901dd2c	eb987180-6608-48d5-a6b3-40c70d2b20cf	lass
9cca0b89-88f3-4992-81b0-d15a30cf8af2	eb987180-6608-48d5-a6b3-40c70d2b20cf	lassie
76070d0f-d3e3-4662-84b0-bae7029e2a5a	eb987180-6608-48d5-a6b3-40c70d2b20cf	char
1ac152d7-9a91-4767-b64e-a2f5371bce04	eb987180-6608-48d5-a6b3-40c70d2b20cf	charlady
330a7112-7544-472e-bbc2-5ccca4bef333	eb987180-6608-48d5-a6b3-40c70d2b20cf	charwoman
c7eaca48-8999-458e-b862-0ec9780851c0	eb987180-6608-48d5-a6b3-40c70d2b20cf	maid
99270145-346c-44d6-894c-8cec58d50b92	38d46729-b11b-4855-b247-b0949f1dbd00	defraud
182e3446-f8b3-4663-b338-11bfcab20696	38d46729-b11b-4855-b247-b0949f1dbd00	get it on
a0542c84-fb73-40f4-ae5b-b5098e563546	38d46729-b11b-4855-b247-b0949f1dbd00	have sex
fe382de1-7a7a-416d-b5e1-3088c3b604dd	38d46729-b11b-4855-b247-b0949f1dbd00	make out
b0a9538a-a21a-4c81-a123-b85835eb513c	e69cc80f-a6aa-4d7a-8e6c-ffdead292e36	bury
16699961-ef09-4185-9ea6-f8f8b4d42e33	e69cc80f-a6aa-4d7a-8e6c-ffdead292e36	entomb
0bb8c448-0ffa-451b-a9c8-e9d43757a2c4	e69cc80f-a6aa-4d7a-8e6c-ffdead292e36	inearth
65e75e9e-fe07-4188-b70e-49fa874e6158	e69cc80f-a6aa-4d7a-8e6c-ffdead292e36	inhume
054a2715-02e8-4e2d-a246-59d4f67300b9	c431cc1a-077f-44ed-b733-25762d37c142	beast
28bde9cf-644f-4f3a-a638-b219b38b306c	c431cc1a-077f-44ed-b733-25762d37c142	creature
b4f2a963-e419-4a7b-a3de-984a21ec3338	c431cc1a-077f-44ed-b733-25762d37c142	brute
86ed6ec7-b32e-4454-a42c-2a8339774614	c431cc1a-077f-44ed-b733-25762d37c142	monster
4101b7c7-2949-4ca7-a68b-41da93651cff	c431cc1a-077f-44ed-b733-25762d37c142	savage
\.


--
-- Data for Name: gamelevels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gamelevels (id, setid, levelnumber, name, difficulty, timelimit, passscore, islocked, createdat) FROM stdin;
272f6249-9f90-4839-b660-f7fbc4e98927	2f2131f7-33c3-4c00-a3c9-7db3c93b9ea2	1	Khởi động	easy	120	60	f	2026-05-12 07:58:43.102497
013fdce3-0f74-4768-a98a-f512e26b0574	2f2131f7-33c3-4c00-a3c9-7db3c93b9ea2	2	Nâng cao	medium	100	70	f	2026-05-12 07:58:43.129076
c6ad2ac8-29c2-4e8d-99e3-8542ac56410e	2f2131f7-33c3-4c00-a3c9-7db3c93b9ea2	3	Thách thức	hard	80	80	f	2026-05-12 07:58:43.144217
\.


--
-- Data for Name: gamesets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gamesets (id, name, description, gametype, icon, orderindex, unlockcondition, createdat) FROM stdin;
2f2131f7-33c3-4c00-a3c9-7db3c93b9ea2	Tổng hợp - Cơ bản	Kết hợp cả 4 loại mini game: Nối từ, Nghe chọn, Nghe xếp câu và Đúng/Sai	mixed	🎮	3	none	2026-05-12 07:58:43.098667
\.


--
-- Data for Name: grammarcategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grammarcategories (id, name, namevi, icon, orderindex) FROM stdin;
40	Passive Voice	Câu bị động	🔄	2
41	Reported Speech	Câu tường thuật	💬	3
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
\.


--
-- Data for Name: grammarquiz; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grammarquiz (id, topicid, question, optiona, optionb, optionc, optiond, correctanswer, explanation) FROM stdin;
93ac3773-985d-4470-bef9-30e35a565a27	5153ff52-b78c-4eb3-8356-bfc30dfb6f14	She ___ to school every day.	goes	go	going	gone	A	Chủ ngữ "She" là ngôi 3 số ít → động từ thêm -es. "go" → "goes".
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
\.


--
-- Data for Name: grammartopics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grammartopics (id, categoryid, title, titlevi, content, orderindex) FROM stdin;
d773bd1b-24cd-4d51-9fad-bd84fa4cb41a	46	Prepositions of Time & Place	Giới từ chỉ thời gian (in, on, at) và nơi chốn	<h3>Giới từ chỉ thời gian</h3><ul><li><strong>Giới từ</strong></li><li><strong>Dùng với</strong></li><li><strong>Ví dụ</strong></li><li><strong>IN</strong></li><li>Tháng, năm, mùa, buổi, thế kỷ</li><li>in May, in 2024, in summer, in the morning, in the 21st century</li><li><strong>ON</strong></li><li>Ngày, thứ, ngày lễ cụ thể</li><li>on Monday, on June 5th, on Christmas Day, on my birthday</li><li><strong>AT</strong></li><li>Giờ, thời điểm cụ thể</li><li>at 7 AM, at noon, at midnight, at night, at the weekend</li></ul><h3>Giới từ chỉ nơi chốn</h3><ul><li><strong>Giới từ</strong></li><li><strong>Dùng với</strong></li><li><strong>Ví dụ</strong></li><li><strong>IN</strong></li><li>Không gian 3D, bên trong</li><li>in the room, in Vietnam, in a box, in the car</li><li><strong>ON</strong></li><li>Bề mặt, trên</li><li>on the table, on the wall, on the 2nd floor, on the bus</li><li><strong>AT</strong></li><li>Một điểm cụ thể</li><li>at school, at the airport, at home, at the door</li></ul><h3>Ngoại lệ cần nhớ</h3><p><strong>at night</strong> (KHÔNG dùng in night)</p><p><strong>at the weekend</strong> (British) / <strong>on the weekend</strong> (American)</p><p><strong>in the morning/afternoon/evening</strong> NHƯNG <strong>at night</strong></p><p><strong>on the bus/train/plane</strong> NHƯNG <strong>in the car/taxi</strong></p>	0
1390d58f-d902-4d8a-a6cc-e455e66c25e7	38	Present Continuous	Thì Hiện Tại Tiếp Diễn	\n<h3>Định nghĩa</h3>\n<p>Thì Hiện tại tiếp diễn (Present Continuous / Present Progressive) diễn tả <b>hành động đang xảy ra ngay tại thời điểm nói</b>, hoặc <b>hành động tạm thời</b> xung quanh thời điểm hiện tại, hoặc <b>kế hoạch đã lên lịch</b> trong tương lai gần.</p>\n\n<h3>Cấu trúc chi tiết</h3>\n\n<ul><li><strong>Dạng câu</strong></li><li><strong>Cấu trúc</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li><b>Khẳng định</b></li><li>S + am/is/are + V-ing</li><li>I <b>am reading</b> a book.</li></ul>\n<ul><li><b>Phủ định</b></li><li>S + am/is/are + not + V-ing</li><li>She <b>isn't watching</b> TV.</li></ul>\n<ul><li><b>Nghi vấn</b></li><li>Am/Is/Are + S + V-ing?</li><li><b>Are</b> you <b>listening</b>?</li></ul>\n\n\n<h3>📏 Quy tắc thêm -ing</h3>\n\n<ul><li><strong>Quy tắc</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li>Hầu hết: thêm <b>-ing</b></li><li>read → read<b>ing</b>, play → play<b>ing</b></li></ul>\n<ul><li>Tận cùng -e câm: bỏ e, thêm <b>-ing</b></li><li>make → mak<b>ing</b>, write → writ<b>ing</b></li></ul>\n<ul><li>Tận cùng 1 nguyên âm + 1 phụ âm (1 âm tiết): nhân đôi phụ âm</li><li>run → ru<b>nn</b>ing, sit → si<b>tt</b>ing, swim → swi<b>mm</b>ing</li></ul>\n<ul><li>Tận cùng -ie: đổi ie → y, thêm -ing</li><li>die → d<b>y</b>ing, lie → l<b>y</b>ing</li></ul>\n<ul><li>Tận cùng -ee: giữ nguyên, thêm -ing</li><li>see → see<b>ing</b>, agree → agree<b>ing</b></li></ul>\n\n\n<h3>Cách dùng chi tiết</h3>\n<p><b>1. Hành động đang diễn ra ngay lúc nói:</b></p>\n<p>Shhh! The baby <b>is sleeping</b>. <i>(Suỵt! Em bé đang ngủ.)</i></p>\n<p>Look! It <b>is raining</b> outside. <i>(Nhìn kìa! Trời đang mưa ngoài kia.)</i></p>\n\n<p><b>2. Hành động tạm thời (không phải thói quen):</b></p>\n<p>I usually drive to work, but today I <b>am taking</b> the bus. <i>(Tôi thường lái xe đi làm, nhưng hôm nay tôi đang đi xe buýt.)</i></p>\n<p>She <b>is staying</b> with her sister this week. <i>(Cô ấy đang ở cùng chị gái tuần này.)</i></p>\n\n<p><b>3. Kế hoạch chắc chắn trong tương lai gần:</b></p>\n<p>We <b>are meeting</b> the client at 3 PM tomorrow. <i>(Chúng tôi sẽ gặp khách hàng lúc 3 giờ chiều mai.)</i></p>\n<p>I <b>am flying</b> to Hanoi next Monday. <i>(Tôi bay ra Hà Nội thứ Hai tuần sau.)</i></p>\n\n<p><b>4. Xu hướng đang thay đổi:</b></p>\n<p>The population <b>is growing</b> rapidly. <i>(Dân số đang tăng nhanh chóng.)</i></p>\n<p>Online shopping <b>is becoming</b> more popular. <i>(Mua sắm trực tuyến đang trở nên phổ biến hơn.)</i></p>\n\n<h3>🚫 Động từ KHÔNG dùng với thì tiếp diễn (Stative Verbs)</h3>\n<p>\n<b>Cảm xúc:</b> love, hate, like, want, need, prefer<br>\n<b>Nhận thức:</b> know, believe, understand, remember, forget, think (= nghĩ rằng)<br>\n<b>Sở hữu:</b> have (= sở hữu), own, belong, possess<br>\n<b>Giác quan:</b> see, hear, smell, taste (khi mang nghĩa tự nhiên)<br>\nI <b>am knowing</b> the answer. → I <b>know</b> the answer.\n</p>\n\n<h3>Dấu hiệu nhận biết</h3>\n<p>\nnow, right now, at the moment, at present, currently, today, tonight, this week/month<br>\nCác cảm thán: <b>Look!</b>, <b>Listen!</b>, <b>Be quiet!</b>, <b>Watch out!</b>\n</p>\n\n<h3>Lỗi sai thường gặp</h3>\n<p>\nShe <b>is work</b> now. → She <b>is working</b> now. <i>(Thiếu -ing)</i><br>\nI <b>am wanting</b> a coffee. → I <b>want</b> a coffee. <i>(want là stative verb)</i><br>\nHe <b>is runing</b>. → He <b>is running</b>. <i>(run: nhân đôi phụ âm n)</i>\n</p>	1
9e91d53c-79f4-4d39-88b1-e371f22faf60	38	Present Perfect	Thì Hiện Tại Hoàn Thành	\n<h3>Định nghĩa</h3>\n<p>Thì Hiện tại hoàn thành (Present Perfect) diễn tả hành động <b>đã xảy ra trong quá khứ nhưng có liên quan đến hiện tại</b>, hoặc hành động <b>bắt đầu trong quá khứ và kéo dài đến hiện tại</b>.</p>\n\n<h3>Cấu trúc chi tiết</h3>\n\n<ul><li><strong>Dạng câu</strong></li><li><strong>Cấu trúc</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li><b>Khẳng định</b></li><li>S + have/has + V3 (past participle)</li><li>I <b>have finished</b> my homework.</li></ul>\n<ul><li><b>Phủ định</b></li><li>S + have/has + not + V3</li><li>She <b>hasn't eaten</b> lunch yet.</li></ul>\n<ul><li><b>Nghi vấn</b></li><li>Have/Has + S + V3?</li><li><b>Have</b> you ever <b>been</b> to Japan?</li></ul>\n\n<p><b>Lưu ý:</b> I/you/we/they → <b>have</b> | he/she/it → <b>has</b></p>\n\n<h3>Cách dùng chi tiết</h3>\n<p><b>1. Kinh nghiệm, trải nghiệm (không nói thời gian cụ thể):</b></p>\n<p>I <b>have visited</b> Paris three times. <i>(Tôi đã đến Paris ba lần.)</i></p>\n<p><b>Have</b> you ever <b>tried</b> sushi? <i>(Bạn đã bao giờ thử sushi chưa?)</i></p>\n<p>She <b>has never seen</b> snow. <i>(Cô ấy chưa bao giờ nhìn thấy tuyết.)</i></p>\n\n<p><b>2. Hành động vừa mới xảy ra (just, already, yet):</b></p>\n<p>He <b>has just arrived</b>. <i>(Anh ấy vừa mới đến.)</i></p>\n<p>I <b>have already done</b> my homework. <i>(Tôi đã làm xong bài tập rồi.)</i></p>\n<p><b>Has</b> the meeting <b>started</b> yet? <i>(Cuộc họp đã bắt đầu chưa?)</i></p>\n\n<p><b>3. Hành động kéo dài từ quá khứ đến hiện tại (since, for):</b></p>\n<p>I <b>have lived</b> here <b>since</b> 2010. <i>(Tôi đã sống ở đây từ năm 2010.)</i></p>\n<p>She <b>has worked</b> at this company <b>for</b> 5 years. <i>(Cô ấy đã làm việc ở công ty này được 5 năm.)</i></p>\n<p>We <b>have known</b> each other <b>since</b> childhood. <i>(Chúng tôi đã biết nhau từ nhỏ.)</i></p>\n\n<h3>Since vs For</h3>\n\n<ul><li><strong>SINCE (từ khi — mốc thời gian)</strong></li><li><strong>FOR (được — khoảng thời gian)</strong></li></ul>\n<ul><li>since 2020, since Monday, since I was a child, since last summer, since 8 AM</li><li>for 5 years, for 3 hours, for a long time, for two weeks, for ages</li></ul>\n\n\n<h3>Dấu hiệu nhận biết</h3>\n<p>\n<b>just</b> (vừa mới), <b>already</b> (đã...rồi), <b>yet</b> (chưa — dùng trong phủ định và nghi vấn)<br>\n<b>ever</b> (đã bao giờ), <b>never</b> (chưa bao giờ), <b>since</b> (từ khi), <b>for</b> (trong khoảng)<br>\n<b>so far</b> (cho đến nay), <b>up to now / until now</b> (cho đến bây giờ), <b>recently / lately</b> (gần đây)\n</p>\n\n<h3>Phân biệt HTHT vs Quá khứ đơn</h3>\n<p>\nI <b>have gone</b> to Paris <b>last year</b>. → I <b>went</b> to Paris last year. <i>(Có mốc thời gian cụ thể "last year" → dùng QKĐ)</i><br>\nI <b>have been</b> to Paris. <i>(Không nói khi nào → HTHT: kinh nghiệm)</i><br><br>\n<b>Quy tắc:</b> Có thời gian cụ thể trong quá khứ (yesterday, last week, in 2019...) → dùng <b>Past Simple</b>.<br>\nKhông có / không cần thời gian cụ thể → dùng <b>Present Perfect</b>.\n</p>	2
90ad11e3-ee89-49c2-a421-0ef502b8744a	38	Past Simple	Thì Quá Khứ Đơn	\n<h3>Định nghĩa</h3>\n<p>Thì Quá khứ đơn (Past Simple) diễn tả <b>hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ</b>, thường đi kèm với mốc thời gian cụ thể.</p>\n\n<h3>Cấu trúc chi tiết</h3>\n\n<ul><li><strong>Dạng câu</strong></li><li><strong>V thường</strong></li><li><strong>V to be</strong></li></ul>\n<ul><li><b>Khẳng định</b></li><li>S + V2/ed</li><li>S + was/were</li></ul>\n<ul><li><b>Phủ định</b></li><li>S + did not + V (nguyên thể)</li><li>S + was/were + not</li></ul>\n<ul><li><b>Nghi vấn</b></li><li>Did + S + V (nguyên thể)?</li><li>Was/Were + S...?</li></ul>\n\n\n<h3>📏 Quy tắc chia động từ có quy tắc thêm -ed</h3>\n\n<ul><li><strong>Quy tắc</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li>Hầu hết: thêm <b>-ed</b></li><li>play → play<b>ed</b>, work → work<b>ed</b></li></ul>\n<ul><li>Tận cùng -e: thêm <b>-d</b></li><li>live → live<b>d</b>, love → love<b>d</b></li></ul>\n<ul><li>Tận cùng phụ âm + y: đổi y → <b>-ied</b></li><li>study → stud<b>ied</b>, carry → carr<b>ied</b></li></ul>\n<ul><li>1 nguyên âm + 1 phụ âm (1 âm tiết): nhân đôi</li><li>stop → sto<b>pp</b>ed, plan → pla<b>nn</b>ed</li></ul>\n\n\n<h3>📋 Động từ bất quy tắc phổ biến</h3>\n\n<ul><li><strong>V1</strong></li><li><strong>V2</strong></li><li><strong>V3</strong></li><li><strong>Nghĩa</strong></li></ul>\n<ul><li>go</li><li><b>went</b></li><li>gone</li><li>đi</li></ul>\n<ul><li>come</li><li><b>came</b></li><li>come</li><li>đến</li></ul>\n<ul><li>eat</li><li><b>ate</b></li><li>eaten</li><li>ăn</li></ul>\n<ul><li>see</li><li><b>saw</b></li><li>seen</li><li>nhìn</li></ul>\n<ul><li>buy</li><li><b>bought</b></li><li>bought</li><li>mua</li></ul>\n<ul><li>take</li><li><b>took</b></li><li>taken</li><li>lấy</li></ul>\n<ul><li>give</li><li><b>gave</b></li><li>given</li><li>cho</li></ul>\n<ul><li>write</li><li><b>wrote</b></li><li>written</li><li>viết</li></ul>\n\n\n<h3>Cách dùng</h3>\n<p><b>1. Hành động đã xảy ra và kết thúc trong quá khứ:</b></p>\n<p>I <b>visited</b> my grandparents <b>last weekend</b>. <i>(Tôi đã thăm ông bà cuối tuần trước.)</i></p>\n<p>She <b>graduated</b> from university <b>in 2020</b>. <i>(Cô ấy tốt nghiệp đại học năm 2020.)</i></p>\n\n<p><b>2. Chuỗi hành động liên tiếp trong quá khứ:</b></p>\n<p>He <b>woke up</b>, <b>brushed</b> his teeth, and <b>had</b> breakfast. <i>(Anh ấy thức dậy, đánh răng và ăn sáng.)</i></p>\n\n<h3>Dấu hiệu nhận biết</h3>\n<p>\nyesterday, last night/week/month/year, ago (2 days ago), in 2019, when I was young, this morning (nếu đã qua)\n</p>\n\n<h3>Lỗi sai thường gặp</h3>\n<p>\nShe <b>didn't went</b>. → She <b>didn't go</b>. <i>(Sau didn't, V luôn ở nguyên thể)</i><br>\n<b>Did</b> you <b>went</b>? → <b>Did</b> you <b>go</b>? <i>(Sau Did, V ở nguyên thể)</i><br>\nI <b>goed</b> to school. → I <b>went</b> to school. <i>(go là V bất quy tắc)</i>\n</p>	3
22f8f287-7934-484c-86cc-25caa5320092	38	Future Simple	Thì Tương Lai Đơn	\n<h3>Định nghĩa</h3>\n<p>Thì Tương lai đơn (Future Simple) diễn tả <b>dự đoán</b>, <b>quyết định tại thời điểm nói</b>, <b>lời hứa</b>, <b>đề nghị</b>, hoặc <b>sự kiện sẽ xảy ra trong tương lai</b>.</p>\n\n<h3>Cấu trúc</h3>\n\n<ul><li><strong>Dạng câu</strong></li><li><strong>Cấu trúc</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li><b>Khẳng định</b></li><li>S + will + V (nguyên thể)</li><li>I <b>will call</b> you later.</li></ul>\n<ul><li><b>Phủ định</b></li><li>S + will not (won't) + V</li><li>She <b>won't come</b> tomorrow.</li></ul>\n<ul><li><b>Nghi vấn</b></li><li>Will + S + V?</li><li><b>Will</b> you <b>help</b> me?</li></ul>\n\n\n<h3>Cách dùng</h3>\n<p><b>1. Quyết định ngay tại thời điểm nói (spontaneous decision):</b></p>\n<p>[Chuông điện thoại reo] I<b>'ll answer</b> it. <i>(Tôi sẽ nghe máy.)</i></p>\n<p>I'm hungry. I <b>think I'll order</b> a pizza. <i>(Tôi đói. Tôi nghĩ tôi sẽ đặt pizza.)</i></p>\n\n<p><b>2. Lời hứa:</b></p>\n<p>I <b>will always love</b> you. <i>(Anh sẽ luôn yêu em.)</i></p>\n<p>I <b>promise I won't tell</b> anyone. <i>(Tôi hứa tôi sẽ không nói với ai.)</i></p>\n\n<p><b>3. Dự đoán (không có căn cứ rõ ràng):</b></p>\n<p>I <b>think</b> it <b>will rain</b> tomorrow. <i>(Tôi nghĩ ngày mai trời sẽ mưa.)</i></p>\n\n<p><b>4. Đề nghị, yêu cầu lịch sự:</b></p>\n<p><b>Will</b> you <b>open</b> the window, please? <i>(Bạn vui lòng mở cửa sổ được không?)</i></p>\n<p><b>Shall I help</b> you with that? <i>(Tôi giúp bạn việc đó nhé?)</i></p>\n\n<h3>Phân biệt Will vs Be going to</h3>\n\n<ul><li><strong>WILL</strong></li><li><strong>BE GOING TO</strong></li></ul>\n<ul><li>Quyết định ngay tại thời điểm nói</li><li>Kế hoạch, dự định đã có từ trước</li></ul>\n<ul><li>Dự đoán dựa trên ý kiến cá nhân</li><li>Dự đoán dựa trên bằng chứng hiện tại</li></ul>\n<ul><li><i>I'll have the chicken.</i> (vừa quyết định)</li><li><i>I'm going to visit Paris next month.</i> (đã lên kế hoạch)</li></ul>\n<ul><li><i>I think it will rain.</i> (dự đoán cá nhân)</li><li><i>Look at those clouds. It's going to rain.</i> (có bằng chứng)</li></ul>\n\n\n<h3>Dấu hiệu nhận biết</h3>\n<p>\ntomorrow, next week/month/year, I think/believe/hope, probably, perhaps, maybe, in the future, someday\n</p>	4
ae1a29d5-7711-46ff-bfed-f66c51979174	42	Modal Verbs	Động từ khuyết thiếu: can, could, must, should, may, might	\n<h3>Đặc điểm chung</h3>\n<ul>\n<li>Luôn đi với <b>V nguyên thể</b> (không chia, không thêm to)</li>\n<li>Không có dạng V-ing, V3, hay thêm -s/-es</li>\n<li>Tự tạo phủ định (thêm not) và nghi vấn (đảo lên trước S)</li>\n</ul>\n\n<h3>Bảng tổng hợp</h3>\n\n<ul><li><strong>Modal</strong></li><li><strong>Nghĩa chính</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li><b>can</b></li><li>Có thể (khả năng), cho phép</li><li>I <b>can</b> swim. / You <b>can</b> go now.</li></ul>\n<ul><li><b>could</b></li><li>Có thể (quá khứ), lịch sự</li><li><b>Could</b> you help me? / I <b>could</b> read at age 5.</li></ul>\n<ul><li><b>must</b></li><li>Phải (bắt buộc), chắc chắn</li><li>You <b>must</b> wear a helmet. / She <b>must</b> be tired.</li></ul>\n<ul><li><b>mustn't</b></li><li>Cấm, không được</li><li>You <b>mustn't</b> smoke here.</li></ul>\n<ul><li><b>should</b></li><li>Nên (lời khuyên)</li><li>You <b>should</b> see a doctor.</li></ul>\n<ul><li><b>may</b></li><li>Có thể (xin phép), khả năng</li><li><b>May</b> I come in? / It <b>may</b> rain.</li></ul>\n<ul><li><b>might</b></li><li>Có thể (khả năng thấp)</li><li>He <b>might</b> be late.</li></ul>\n<ul><li><b>have to</b></li><li>Phải (bắt buộc bên ngoài)</li><li>I <b>have to</b> work on Saturday.</li></ul>\n\n\n<h3>Phân biệt must vs have to vs should</h3>\n<p>\n<b>must:</b> bắt buộc (nội quy, luật) — You <b>must</b> stop at a red light.<br>\n<b>have to:</b> bắt buộc (hoàn cảnh bên ngoài) — I <b>have to</b> wake up early for work.<br>\n<b>should:</b> nên (lời khuyên, không bắt buộc) — You <b>should</b> drink more water.<br>\n<b>mustn't:</b> CẤM — You <b>mustn't</b> cheat in the exam.<br>\n<b>don't have to:</b> KHÔNG CẦN — You <b>don't have to</b> come if you don't want. (Bạn không cần phải đến.)\n</p>	0
165b74f8-2224-4556-bf9a-8f3aadea49fd	43	Comparatives & Superlatives	So sánh hơn và So sánh nhất	\n<h3>Quy tắc tổng hợp</h3>\n\n<ul><li><strong>Loại</strong></li><li><strong>So sánh hơn</strong></li><li><strong>So sánh nhất</strong></li></ul>\n<ul><li>Tính từ ngắn (1 âm tiết)</li><li>adj + <b>-er</b> + than</li><li><b>the</b> + adj + <b>-est</b></li></ul>\n<ul><li>Tính từ kết thúc -e</li><li>adj + <b>-r</b> + than</li><li><b>the</b> + adj + <b>-st</b></li></ul>\n<ul><li>Tính từ kết thúc 1NÂ+1PÂ</li><li>nhân đôi PÂ + <b>-er</b></li><li>nhân đôi PÂ + <b>-est</b></li></ul>\n<ul><li>Tính từ dài (2+ âm tiết)</li><li><b>more</b> + adj + than</li><li><b>the most</b> + adj</li></ul>\n<ul><li>Bất quy tắc</li><li>good → better → best | bad → worse → worst | far → farther → farthest | much/many → more → most | little → less → least</li></ul>\n\n\n<h3>Ví dụ</h3>\n<p>Tokyo is <b>bigger than</b> Osaka. <i>(Tokyo lớn hơn Osaka.)</i></p>\n<p>This book is <b>more interesting than</b> that one. <i>(Cuốn sách này thú vị hơn cuốn kia.)</i></p>\n<p>Mount Everest is <b>the highest</b> mountain in the world. <i>(Everest là ngọn núi cao nhất TG.)</i></p>\n\n<h3>So sánh bằng: as...as</h3>\n<p><b>S + be + as + adj + as + O</b></p>\n<p>She is <b>as tall as</b> her brother. <i>(Cô ấy cao bằng anh trai.)</i></p>\n<p>He is <b>not as rich as</b> his father. <i>(Anh ấy không giàu bằng bố.)</i></p>	0
5153ff52-b78c-4eb3-8356-bfc30dfb6f14	38	Present Simple	Thì Hiện Tại Đơn	<h3>Định nghĩa</h3><p>Thì Hiện tại đơn (Present Simple) diễn tả một <strong>sự thật hiển nhiên</strong>, <strong>thói quen lặp đi lặp lại</strong>, hoặc một <strong>trạng thái cố định</strong> ở hiện tại. Đây là thì cơ bản và quan trọng nhất trong tiếng Anh.</p><h3>Cấu trúc chi tiết</h3><ul><li><strong>Dạng câu</strong></li><li><strong>Cấu trúc</strong></li><li><strong>Ví dụ</strong></li><li><strong>Khẳng định</strong></li><li>S + V(s/es)</li><li>She <strong>works</strong> at a bank.</li><li><strong>Phủ định</strong></li><li>S + do/does + not + V(nguyên thể)</li><li>She <strong>doesn't work</strong> at a bank.</li><li><strong>Nghi vấn</strong></li><li>Do/Does + S + V(nguyên thể)?</li><li><strong>Does</strong> she <strong>work</strong> at a bank?</li><li><strong>WH-question</strong></li><li>Wh- + do/does + S + V?</li><li><strong>Where does</strong> she <strong>work</strong>?</li></ul><h3>📏 Quy tắc thêm -s/-es cho ngôi thứ 3 số ít (he/she/it)</h3><ul><li><strong>Quy tắc</strong></li><li><strong>Ví dụ</strong></li><li>Hầu hết các động từ: thêm <strong>-s</strong></li><li>play → play<strong>s</strong>, read → read<strong>s</strong></li><li>Tận cùng -s, -ss, -sh, -ch, -x, -z, -o: thêm <strong>-es</strong></li><li>watch → watch<strong>es</strong>, go → go<strong>es</strong>, miss → miss<strong>es</strong></li><li>Tận cùng phụ âm + y: đổi y → <strong>-ies</strong></li><li>study → stud<strong>ies</strong>, carry → carr<strong>ies</strong></li><li>Tận cùng nguyên âm + y: thêm <strong>-s</strong></li><li>play → play<strong>s</strong>, enjoy → enjoy<strong>s</strong></li><li>Trường hợp đặc biệt: <strong>have → has</strong></li><li>She <strong>has</strong> a beautiful house.</li></ul><h3>Cách dùng chi tiết</h3><p><strong>1. Thói quen, hành động lặp đi lặp lại:</strong></p><p>I <strong>wake up</strong> at 6 AM every morning. <em>(Tôi thức dậy lúc 6 giờ sáng mỗi ngày.)</em></p><p>My mother <strong>cooks</strong> dinner every evening. <em>(Mẹ tôi nấu bữa tối mỗi buổi chiều.)</em></p><p>We <strong>don't eat</strong> meat on Fridays. <em>(Chúng tôi không ăn thịt vào thứ Sáu.)</em></p><p><strong>2. Sự thật hiển nhiên, chân lý, quy luật tự nhiên:</strong></p><p>The Earth <strong>revolves</strong> around the Sun. <em>(Trái Đất quay quanh Mặt Trời.)</em></p><p>Water <strong>freezes</strong> at 0°C. <em>(Nước đóng băng ở 0°C.)</em></p><p>Light <strong>travels</strong> faster than sound. <em>(Ánh sáng truyền nhanh hơn âm thanh.)</em></p><p><strong>3. Lịch trình, thời gian biểu cố định:</strong></p><p>The train <strong>departs</strong> at 7:30 AM. <em>(Tàu khởi hành lúc 7:30 sáng.)</em></p><p>The shop <strong>opens</strong> at 9 and <strong>closes</strong> at 6. <em>(Cửa hàng mở cửa lúc 9 và đóng cửa lúc 6.)</em></p><p><strong>4. Trạng thái, cảm xúc, suy nghĩ (stative verbs):</strong></p><p>She <strong>loves</strong> chocolate. <em>(Cô ấy yêu thích sô-cô-la.)</em></p><p>I <strong>believe</strong> you are right. <em>(Tôi tin rằng bạn đúng.)</em></p><p>He <strong>owns</strong> three cars. <em>(Anh ấy sở hữu ba chiếc xe.)</em></p><h3>Dấu hiệu nhận biết</h3><p><strong>Trạng từ tần suất:</strong> always, usually, often, sometimes, rarely, seldom, never, hardly ever</p><p><strong>Cụm từ chỉ thời gian:</strong> every day/week/month/year, once a week, twice a month, on Mondays, in the morning/afternoon/evening</p><h3>Lỗi sai thường gặp</h3><p>She <strong>don't</strong> like coffee. → She <strong>doesn't</strong> like coffee. <em>(Ngôi 3 số ít dùng doesn't)</em></p><p>He <strong>playes</strong> guitar. → He <strong>plays</strong> guitar. <em>(play tận cùng nguyên âm+y → chỉ thêm s)</em></p><p><strong>Does</strong> she <strong>works</strong>? → <strong>Does</strong> she <strong>work</strong>? <em>(Sau does, V trở về nguyên thể)</em></p><p>I <strong>am go</strong> to school. → I <strong>go</strong> to school. <em>(HTĐ không dùng to be + V thường)</em></p><h3>Mẹo ghi nhớ</h3><p>Quy tắc vàng: Khi câu có <strong>does/doesn't</strong>, động từ chính LUÔN ở <strong>nguyên thể</strong> (không thêm -s/-es).</p><p>Nhớ: <strong>"Does ăn hết chữ S"</strong> → Does she works? → Does she work?</p>	0
e088946a-b0cf-494c-9746-85e1420a95c1	39	Zero & First Conditional	Câu điều kiện loại 0 & 1	\n<h3>Câu điều kiện loại 0 — Sự thật hiển nhiên</h3>\n\n<ul><li><strong>Cấu trúc</strong></li><li><strong>If + S + V (HTĐ), S + V (HTĐ)</strong></li></ul>\n\n<p>Dùng khi kết quả <b>luôn luôn đúng</b>, là sự thật khoa học hoặc quy luật tự nhiên.</p>\n<p>If you <b>heat</b> ice, it <b>melts</b>. <i>(Nếu bạn đun nóng đá, nó tan.)</i></p>\n<p>If you <b>don't water</b> plants, they <b>die</b>. <i>(Nếu bạn không tưới cây, chúng chết.)</i></p>\n\n<h3>Câu điều kiện loại 1 — Có thể xảy ra ở hiện tại/tương lai</h3>\n\n<ul><li><strong>Cấu trúc</strong></li><li><strong>If + S + V (HTĐ), S + will + V</strong></li></ul>\n\n<p>Dùng khi điều kiện <b>có thể xảy ra</b> trong thực tế ở hiện tại hoặc tương lai.</p>\n<p>If it <b>rains</b>, I <b>will take</b> an umbrella. <i>(Nếu trời mưa, tôi sẽ mang ô.)</i></p>\n<p>If you <b>study</b> hard, you <b>will pass</b> the exam. <i>(Nếu bạn học chăm, bạn sẽ đỗ.)</i></p>\n<p>If she <b>doesn't hurry</b>, she <b>will miss</b> the bus. <i>(Nếu cô ấy không nhanh lên, cô ấy sẽ lỡ xe buýt.)</i></p>\n\n<h3>Lỗi sai thường gặp</h3>\n<p>\nIf it <b>will rain</b>, I will stay home. → If it <b>rains</b>... <i>(Mệnh đề IF không dùng "will"!)</i><br>\nIf you <b>will study</b>... → If you <b>study</b>...\n</p>\n\n<h3>Lưu ý quan trọng</h3>\n<p>\n<b>Quy tắc vàng:</b> Mệnh đề IF trong loại 0 và loại 1 <b>KHÔNG BAO GIỜ</b> dùng "will".<br>\nMệnh đề IF luôn dùng <b>Hiện tại đơn</b>, chỉ mệnh đề chính mới dùng "will".\n</p>	0
72d228e6-5bbe-453f-b7c6-02f9f87c9f2d	39	Second Conditional	Câu điều kiện loại 2	\n<h3>Định nghĩa</h3>\n<p>Câu điều kiện loại 2 diễn tả <b>điều kiện không có thật ở hiện tại</b> — tưởng tượng, ước muốn, giả định trái với thực tế.</p>\n\n<h3>Cấu trúc</h3>\n\n<ul><li><strong>Cấu trúc</strong></li><li><strong>If + S + V2/ed (quá khứ đơn), S + would + V</strong></li></ul>\n\n<p><b>Lưu ý đặc biệt:</b> Trong CĐK loại 2, to be → <b>were</b> cho TẤT CẢ các ngôi (kể cả I, he, she, it).</p>\n\n<h3>Ví dụ</h3>\n<p>If I <b>were</b> rich, I <b>would travel</b> around the world. <i>(Nếu tôi giàu, tôi sẽ đi du lịch vòng quanh TG.) → Thực tế: Tôi KHÔNG giàu.</i></p>\n<p>If I <b>had</b> wings, I <b>would fly</b>. <i>(Nếu tôi có cánh, tôi sẽ bay.) → Thực tế: Tôi KHÔNG có cánh.</i></p>\n<p>If she <b>spoke</b> English, she <b>would get</b> a better job. <i>(Nếu cô ấy nói được tiếng Anh, cô ấy sẽ có công việc tốt hơn.) → Thực tế: Cô ấy KHÔNG nói được tiếng Anh.</i></p>\n\n<h3>Ứng dụng: Cho lời khuyên</h3>\n<p>\nIf I <b>were</b> you, I <b>would study</b> harder. <i>(Nếu tôi là bạn, tôi sẽ học chăm hơn.)</i><br>\n→ Cách nói cho lời khuyên rất phổ biến: <b>"If I were you, I would..."</b>\n</p>	1
898cd0be-8da5-413e-b201-5d622ac826de	39	Third Conditional	Câu điều kiện loại 3	\n<h3>Định nghĩa</h3>\n<p>Câu điều kiện loại 3 diễn tả <b>điều kiện không có thật trong quá khứ</b> — hối tiếc về điều đã xảy ra, giả định trái với quá khứ.</p>\n\n<h3>Cấu trúc</h3>\n\n<ul><li><strong>Cấu trúc</strong></li><li><strong>If + S + had + V3, S + would have + V3</strong></li></ul>\n\n\n<h3>Ví dụ</h3>\n<p>If I <b>had studied</b> harder, I <b>would have passed</b> the exam. <i>(Nếu tôi đã học chăm hơn, tôi đã đỗ kỳ thi.) → Thực tế: Tôi KHÔNG học chăm và KHÔNG đỗ.</i></p>\n<p>If she <b>had left</b> earlier, she <b>wouldn't have missed</b> the flight. <i>(Nếu cô ấy đã đi sớm hơn, cô ấy đã không lỡ chuyến bay.) → Thực tế: Cô ấy đi muộn và LỠ chuyến bay.</i></p>\n\n<h3>So sánh 3 loại câu điều kiện</h3>\n\n<ul><li><strong>Loại</strong></li><li><strong>Mệnh đề IF</strong></li><li><strong>Mệnh đề chính</strong></li><li><strong>Thực tế</strong></li></ul>\n<ul><li><b>Loại 1</b></li><li>V (HTĐ)</li><li>will + V</li><li>Có thể xảy ra</li></ul>\n<ul><li><b>Loại 2</b></li><li>V2/ed (QKĐ)</li><li>would + V</li><li>Không thật ở hiện tại</li></ul>\n<ul><li><b>Loại 3</b></li><li>had + V3 (QKHT)</li><li>would have + V3</li><li>Không thật ở quá khứ</li></ul>\n	2
a75e34b6-a7f5-4c5d-a6a9-a3eb184d53aa	40	Passive Voice	Câu bị động toàn diện	\n<h3>Khi nào dùng câu bị động?</h3>\n<ul>\n<li>Khi <b>không biết</b> hoặc <b>không cần biết</b> ai thực hiện hành động</li>\n<li>Khi muốn <b>nhấn mạnh đối tượng bị tác động</b>, không phải người thực hiện</li>\n<li>Trong văn bản <b>khoa học, báo chí, thông báo chính thức</b></li>\n</ul>\n\n<h3>Công thức tổng quát</h3>\n<p>\n<b>S (tân ngữ cũ) + BE (chia theo thì) + V3/ed + (by + tác nhân)</b>\n</p>\n\n<h3>Bảng chuyển đổi theo từng thì</h3>\n\n<ul><li><strong>Thì</strong></li><li><strong>Chủ động</strong></li><li><strong>Bị động</strong></li></ul>\n<ul><li>HTĐ</li><li>She <b>writes</b> a letter.</li><li>A letter <b>is written</b> (by her).</li></ul>\n<ul><li>HTTD</li><li>She <b>is writing</b> a letter.</li><li>A letter <b>is being written</b>.</li></ul>\n<ul><li>HTHT</li><li>She <b>has written</b> a letter.</li><li>A letter <b>has been written</b>.</li></ul>\n<ul><li>QKĐ</li><li>She <b>wrote</b> a letter.</li><li>A letter <b>was written</b>.</li></ul>\n<ul><li>QKTD</li><li>She <b>was writing</b> a letter.</li><li>A letter <b>was being written</b>.</li></ul>\n<ul><li>TLĐ</li><li>She <b>will write</b> a letter.</li><li>A letter <b>will be written</b>.</li></ul>\n<ul><li>Modal</li><li>She <b>can write</b> a letter.</li><li>A letter <b>can be written</b>.</li></ul>\n\n\n<h3>Thêm ví dụ thực tế</h3>\n<p>English <b>is spoken</b> in many countries. <i>(Tiếng Anh được nói ở nhiều nước.)</i></p>\n<p>The Mona Lisa <b>was painted</b> by Leonardo da Vinci. <i>(Bức Mona Lisa được vẽ bởi Leonardo da Vinci.)</i></p>\n<p>The new bridge <b>is being built</b> now. <i>(Cây cầu mới đang được xây dựng.)</i></p>\n<p>All the tickets <b>have been sold</b>. <i>(Tất cả vé đã được bán hết.)</i></p>\n<p>Homework <b>must be done</b> before class. <i>(Bài tập phải được hoàn thành trước giờ học.)</i></p>\n\n<h3>Lỗi sai thường gặp</h3>\n<p>\nThe cake <b>was make</b> by my mom. → The cake <b>was made</b>. <i>(Phải dùng V3: make → made)</i><br>\nEnglish <b>is speak</b> worldwide. → English <b>is spoken</b>. <i>(speak → spoken)</i><br>\nThe house <b>is build</b>. → The house <b>is being built</b> / <b>was built</b>. <i>(build → built)</i>\n</p>	0
8242916c-9535-4e55-893c-7d1338de5ea1	41	Reported Speech	Câu tường thuật (câu gián tiếp)	\n<h3>Định nghĩa</h3>\n<p>Câu tường thuật (Reported Speech / Indirect Speech) dùng để <b>thuật lại lời nói của người khác</b>, không trích dẫn nguyên văn.</p>\n\n<h3>Bảng lùi thì</h3>\n\n<ul><li><strong>Trực tiếp</strong></li><li><strong>Gián tiếp</strong></li></ul>\n<ul><li>am/is → <b>was</b></li><li>are → <b>were</b></li></ul>\n<ul><li>V1/V(s/es) → <b>V2/ed</b></li><li>am/is/are + V-ing → <b>was/were + V-ing</b></li></ul>\n<ul><li>have/has + V3 → <b>had + V3</b></li><li>V2/ed → <b>had + V3</b></li></ul>\n<ul><li>will → <b>would</b></li><li>can → <b>could</b></li></ul>\n<ul><li>may → <b>might</b></li><li>must → <b>had to</b></li></ul>\n<ul><li>shall → <b>should</b></li><li></li></ul>\n\n\n<h3>Đổi trạng từ</h3>\n\n<ul><li><strong>Trực tiếp</strong></li><li><strong>Gián tiếp</strong></li></ul>\n<ul><li>today → <b>that day</b></li><li>tomorrow → <b>the next day / the following day</b></li></ul>\n<ul><li>yesterday → <b>the day before / the previous day</b></li><li>now → <b>then / at that time</b></li></ul>\n<ul><li>here → <b>there</b></li><li>this → <b>that</b></li></ul>\n<ul><li>these → <b>those</b></li><li>ago → <b>before</b></li></ul>\n\n\n<h3>Ví dụ</h3>\n<p><b>Câu trần thuật:</b> "I am tired." → He said (that) he <b>was</b> tired.</p>\n<p><b>Câu hỏi Yes/No:</b> "Do you like coffee?" → She asked me <b>if/whether</b> I <b>liked</b> coffee.</p>\n<p><b>Câu hỏi Wh:</b> "Where do you live?" → He asked me <b>where</b> I <b>lived</b>.</p>\n<p><b>Câu mệnh lệnh:</b> "Open the door." → She told me <b>to open</b> the door.</p>\n<p><b>Câu phủ định mệnh lệnh:</b> "Don't touch that." → He told me <b>not to touch</b> that.</p>\n\n<h3>Lưu ý quan trọng</h3>\n<p>\nCâu hỏi gián tiếp dùng <b>trật tự câu trần thuật</b> (S + V), KHÔNG đảo ngữ.<br>\nHe asked where <b>did I live</b>. → He asked where <b>I lived</b>.\n</p>	0
f826100c-a5d5-4963-8f8e-8023cb2024f8	44	Relative Clauses	Mệnh đề quan hệ: who, which, that, whose, where, when	\n<h3>Bảng tổng hợp đại từ quan hệ</h3>\n\n<ul><li><strong>Đại từ</strong></li><li><strong>Thay cho</strong></li><li><strong>Chức năng</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li><b>who</b></li><li>Người</li><li>Chủ ngữ / Tân ngữ</li><li>The man <b>who</b> called you is my boss.</li></ul>\n<ul><li><b>whom</b></li><li>Người</li><li>Tân ngữ (trang trọng)</li><li>The girl <b>whom</b> I met was kind.</li></ul>\n<ul><li><b>which</b></li><li>Vật / Sự việc</li><li>Chủ ngữ / Tân ngữ</li><li>The book <b>which</b> I bought is great.</li></ul>\n<ul><li><b>that</b></li><li>Người / Vật</li><li>Chủ ngữ / Tân ngữ</li><li>The car <b>that</b> he drives is red.</li></ul>\n<ul><li><b>whose</b></li><li>Sở hữu</li><li>Thay cho his/her/its/their</li><li>The boy <b>whose</b> father is a doctor.</li></ul>\n<ul><li><b>where</b></li><li>Nơi chốn</li><li>= in/at which</li><li>The city <b>where</b> I was born.</li></ul>\n<ul><li><b>when</b></li><li>Thời gian</li><li>= in/at/on which</li><li>The day <b>when</b> we first met.</li></ul>\n\n\n<h3>Hai loại mệnh đề quan hệ</h3>\n<p><b>1. Xác định (Defining):</b> Cung cấp thông tin THIẾT YẾU, không có dấu phẩy.</p>\n<p>The student <b>who studies hard</b> will pass. <i>(Sinh viên nào học chăm sẽ đỗ.)</i></p>\n\n<p><b>2. Không xác định (Non-defining):</b> Thêm thông tin PHỤ, có dấu phẩy. KHÔNG dùng "that".</p>\n<p>My mother<b>, who is 60,</b> still works every day. <i>(Mẹ tôi, người 60 tuổi, vẫn làm việc mỗi ngày.)</i></p>	0
f49c9967-880b-49d0-b9ca-7ebe37dd0971	45	Articles (A / An / The)	Mạo từ A, An, The và trường hợp không dùng mạo từ	\n<h3>Bảng quy tắc</h3>\n\n<ul><li><strong>Mạo từ</strong></li><li><strong>Khi nào dùng</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li><b>A</b></li><li>Trước DT đếm được số ít, bắt đầu phụ âm. Nhắc đến lần đầu.</li><li>I saw <b>a</b> dog.</li></ul>\n<ul><li><b>An</b></li><li>Trước DT đếm được số ít, bắt đầu nguyên âm (âm đọc).</li><li>She is <b>an</b> engineer. / <b>an</b> hour</li></ul>\n<ul><li><b>The</b></li><li>Cả 2 đều biết. Vật duy nhất. Đã nhắc đến trước đó.</li><li><b>The</b> sun. / I saw a dog. <b>The</b> dog was big.</li></ul>\n<ul><li><b>Ø (không dùng)</b></li><li>DT số nhiều / không đếm được khi nói chung.</li><li><b>Ø</b> Dogs are loyal. / <b>Ø</b> Water is important.</li></ul>\n\n\n<h3>Trường hợp đặc biệt</h3>\n<p>\n<b>an</b> honest person (h câm), <b>an</b> hour, <b>an</b> MBA<br>\n<b>a</b> university (phát âm /juː/), <b>a</b> European country (phát âm /jʊ/)<br>\n→ Quy tắc dựa vào <b>ÂM ĐỌC</b>, không phải chữ cái đầu.\n</p>	0
4f518c44-9b4d-42a4-bade-5b9350334d0f	47	Gerunds & Infinitives	V-ing vs To + V: quy tắc và danh sách động từ	\n<h3>Động từ theo sau bởi V-ing (Gerund)</h3>\n<p>\n<b>enjoy, avoid, finish, mind, suggest, keep, practice, consider, imagine, deny, risk, miss, delay, quit, admit, recall, resist, tolerate, involve, postpone</b>\n</p>\n<p>I <b>enjoy reading</b> books. | She <b>avoids eating</b> junk food. | He <b>finished writing</b> his essay.</p>\n\n<h3>Động từ theo sau bởi To + V (Infinitive)</h3>\n<p>\n<b>want, need, decide, hope, expect, plan, agree, refuse, promise, learn, offer, pretend, seem, appear, manage, afford, deserve, fail, tend, wish</b>\n</p>\n<p>She <b>decided to study</b> abroad. | I <b>want to learn</b> English. | They <b>agreed to help</b>.</p>\n\n<h3>Động từ dùng được CẢ HAI (nghĩa KHÁC nhau)</h3>\n\n<ul><li><strong>Động từ</strong></li><li><strong>+ V-ing</strong></li><li><strong>+ To V</strong></li></ul>\n<ul><li><b>remember</b></li><li>Nhớ ĐÃ LÀM: I remember <b>locking</b> the door.</li><li>Nhớ PHẢI LÀM: Remember <b>to lock</b> the door.</li></ul>\n<ul><li><b>forget</b></li><li>Quên ĐÃ LÀM: I'll never forget <b>meeting</b> her.</li><li>Quên PHẢI LÀM: Don't forget <b>to call</b> me.</li></ul>\n<ul><li><b>stop</b></li><li>Dừng làm gì: He stopped <b>smoking</b>.</li><li>Dừng lại để làm gì: He stopped <b>to smoke</b>.</li></ul>\n<ul><li><b>try</b></li><li>Thử làm: Try <b>adding</b> more salt.</li><li>Cố gắng: Try <b>to finish</b> it.</li></ul>\n\n\n<h3>Sau giới từ: LUÔN dùng V-ing</h3>\n<p>I'm interested <b>in learning</b>. | She's good <b>at cooking</b>. | Thank you <b>for helping</b>.</p>	0
fbbe5a1b-05da-4dfc-adf6-54d1234f026e	48	Question Tags	Câu hỏi đuôi: quy tắc và trường hợp đặc biệt	\n<h3>Quy tắc chính</h3>\n<p>\nCâu <b>khẳng định</b> → đuôi <b>phủ định</b><br>\nCâu <b>phủ định</b> → đuôi <b>khẳng định</b>\n</p>\n\n<h3>Ví dụ theo từng dạng</h3>\n\n<ul><li><strong>Câu chính</strong></li><li><strong>Đuôi</strong></li></ul>\n<ul><li>She <b>is</b> a student,</li><li><b>isn't she</b>?</li></ul>\n<ul><li>They <b>can't</b> swim,</li><li><b>can they</b>?</li></ul>\n<ul><li>You <b>live</b> here,</li><li><b>don't you</b>?</li></ul>\n<ul><li>He <b>didn't</b> call,</li><li><b>did he</b>?</li></ul>\n<ul><li>She <b>has finished</b>,</li><li><b>hasn't she</b>?</li></ul>\n<ul><li>You <b>won't</b> forget,</li><li><b>will you</b>?</li></ul>\n\n\n<h3>Trường hợp đặc biệt</h3>\n<p>• <b>I am</b> right, <b>aren't I</b>? (KHÔNG dùng "amn't I")</p>\n<p>• <b>Let's</b> go, <b>shall we</b>?</p>\n<p>• <b>Don't</b> touch that, <b>will you</b>?</p>\n<p>• <b>Nobody</b> came, <b>did they</b>? (nobody = phủ định → đuôi khẳng định)</p>\n<p>• <b>Everyone</b> is here, <b>aren't they</b>? (everyone → đại từ "they")</p>	0
1a03369b-236d-4c49-b873-04d19962f01a	49	Subject-Verb Agreement	Sự hòa hợp giữa chủ ngữ và động từ	\n<h3>Quy tắc tổng hợp</h3>\n\n<ul><li><strong>Chủ ngữ</strong></li><li><strong>Động từ</strong></li><li><strong>Ví dụ</strong></li></ul>\n<ul><li>Everyone, someone, nobody, each, every</li><li><b>Số ít</b></li><li>Everyone <b>is</b> here.</li></ul>\n<ul><li>Both, many, few, several</li><li><b>Số nhiều</b></li><li>Both <b>are</b> correct.</li></ul>\n<ul><li>The news, mathematics, physics</li><li><b>Số ít</b></li><li>The news <b>is</b> good.</li></ul>\n<ul><li>Either A or B / Neither A nor B</li><li><b>Theo B (gần nhất)</b></li><li>Neither he nor they <b>are</b> coming.</li></ul>\n<ul><li>A number of + N</li><li><b>Số nhiều</b></li><li>A number of students <b>are</b> absent.</li></ul>\n<ul><li>The number of + N</li><li><b>Số ít</b></li><li>The number of students <b>is</b> 50.</li></ul>\n\n\n<h3>Ví dụ thêm</h3>\n<p>Each student <b>has</b> a textbook. <i>(Mỗi sinh viên có một cuốn sách.)</i></p>\n<p>Neither the teacher nor the students <b>were</b> happy. <i>(Chia theo SN gần nhất: students → số nhiều)</i></p>\n<p>The United States <b>is</b> a big country. <i>(Tên nước → số ít dù có -s)</i></p>	0
\.


--
-- Data for Name: learninglevels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.learninglevels (id, code, name, description) FROM stdin;
1	BEGINNER	Người mới học	Chưa biết hoặc biết rất ít
2	INTERMEDIATE	Cơ bản	Đã biết chút ít
3	ADVANCED	Nâng cao	Đã học lâu, sử dụng tốt
\.


--
-- Data for Name: lessonmedia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessonmedia (id, lessonid, mediatype, mediaurl, description) FROM stdin;
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, courseid, title, content, type, levelid, orderindex) FROM stdin;
\.


--
-- Data for Name: lessonvocabulary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessonvocabulary (lessonid, vocabid) FROM stdin;
\.


--
-- Data for Name: minigamequestions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.minigamequestions (id, levelid, questiontype, contenten, contentvi, audiourl, imageurl, correctanswer, options, orderindex) FROM stdin;
676e9351-ea3a-4dec-a09b-7c9f788a1af5	272f6249-9f90-4839-b660-f7fbc4e98927	matching	Apple	Táo	\N	\N	Apple	[]	0
60dc55f7-0ce1-45f9-bfeb-a87a2d6d6bb6	272f6249-9f90-4839-b660-f7fbc4e98927	matching	Water	Nước	\N	\N	Water	[]	1
161d2eeb-cbe7-49d4-ac6f-4483ff29ff95	272f6249-9f90-4839-b660-f7fbc4e98927	listening	Good morning	Chào buổi sáng	\N	\N	Good morning	["Good night","Good morning","Good afternoon","Hello"]	2
ae6f30b2-fddb-40ea-9e1b-0319605ba9bd	272f6249-9f90-4839-b660-f7fbc4e98927	listening	Thank you	Cảm ơn	\N	\N	Thank you	["Excuse me","Sorry","Thank you","Please"]	3
425293ba-f0da-4e59-91bd-acbc714a409e	272f6249-9f90-4839-b660-f7fbc4e98927	listenbuild	I go to school	Tôi đi học	\N	\N	I go to school	["I","go","to","school"]	4
79adbd47-36a9-495b-8235-053b39af90d8	272f6249-9f90-4839-b660-f7fbc4e98927	listenbuild	She is my friend	Cô ấy là bạn tôi	\N	\N	She is my friend	["She","is","my","friend"]	5
fdb929ac-a4fa-4392-8ee8-7574a8eb860c	272f6249-9f90-4839-b660-f7fbc4e98927	listenbuild	We eat lunch	Chúng tôi ăn trưa	\N	\N	We eat lunch	["We","eat","lunch"]	6
49e976f4-1a3e-49ea-a8a5-813b24528a5d	272f6249-9f90-4839-b660-f7fbc4e98927	truefalse	Hello	Xin chào	\N	\N	true	[]	7
c00e17c5-4fb2-4268-96ee-3e96957cdbc9	272f6249-9f90-4839-b660-f7fbc4e98927	truefalse	Goodbye	Hẹn gặp lại	\N	\N	true	[]	8
495d4e79-10d6-49b0-b889-d3934b11fdda	272f6249-9f90-4839-b660-f7fbc4e98927	truefalse	Cat	Con chó	\N	\N	false	[]	9
b9ea7f3c-b1a0-4413-9caf-7348ac3f2fcf	013fdce3-0f74-4768-a98a-f512e26b0574	matching	Beautiful	Đẹp	\N	\N	Beautiful	[]	0
0687340a-2041-42ce-80f4-11e85db9026c	013fdce3-0f74-4768-a98a-f512e26b0574	matching	Important	Quan trọng	\N	\N	Important	[]	1
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
\.


--
-- Data for Name: quiz; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz (id, lessonid, question, type, correctanswer) FROM stdin;
\.


--
-- Data for Name: quizoptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quizoptions (id, quizid, optiontext) FROM stdin;
\.


--
-- Data for Name: speakinglessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.speakinglessons (id, title, description, orderindex, createdat) FROM stdin;
f7c7bb21-bfad-4d5f-9057-aa493a6a2116	Chào hỏi cơ bản	Các mẫu câu chào hỏi hàng ngày	1	2026-05-11 11:31:32.770487
d3c02bda-d397-43f2-8b34-305067ac0b6d	Giới thiệu bản thân	Nói về bản thân và gia đình	2	2026-05-11 11:31:32.785334
b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	Tại nhà hàng	Giao tiếp khi đi ăn uống	3	2026-05-11 11:31:32.793291
eb5ed411-41ff-4422-bae2-1b551e4cc00e	Hỏi đường	Hỏi và chỉ đường đi	4	2026-05-11 11:31:32.799688
401e2660-0deb-41d5-a1d4-21e546fdff31	Mua sắm	Giao tiếp khi đi mua hàng	5	2026-05-11 11:31:32.806681
add4d9ce-4642-45a9-a254-f380d3204358	Sở thích cá nhân	Nói về những gì bạn thích làm	6	2026-05-11 11:31:32.814185
24cb48d7-066b-4334-8604-62712620008c	Tại bệnh viện	Miêu tả triệu chứng và khám bệnh	7	2026-05-11 11:31:32.821264
be4dc1b9-34a6-4313-aa51-7b1340e2260b	Đi du lịch	Giao tiếp khi đi du lịch	8	2026-05-11 11:31:32.828978
9bbb60b0-8850-4d9a-adc3-ac63668092e8	Công việc	Nói về nghề nghiệp và công việc	9	2026-05-11 11:31:32.836722
f375bb3e-c3fb-45a8-92f6-ab43b5061ae6	Thời tiết	Nói về thời tiết và mùa	10	2026-05-11 11:31:32.845521
\.


--
-- Data for Name: speakingprogress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.speakingprogress (userid, lessonid, status, score, updatedat) FROM stdin;
63067d89-05de-4a11-9fe9-1fba5b52ea9e	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	completed	100	2026-05-11 23:54:35.202028
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	completed	100	2026-05-11 23:56:20.172256
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	d3c02bda-d397-43f2-8b34-305067ac0b6d	completed	100	2026-05-11 23:57:16.507516
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	completed	100	2026-05-11 23:58:40.833032
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	eb5ed411-41ff-4422-bae2-1b551e4cc00e	completed	100	2026-05-12 00:01:19.902307
\.


--
-- Data for Name: speakingquestions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.speakingquestions (id, lessonid, question, translation, option1, option1vi, option2, option2vi, option3, option3vi, orderindex) FROM stdin;
8df35393-bbaf-4ce7-bf14-9de564db1250	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	How are you doing today?	Hôm nay bạn thế nào?	I am doing well, thank you.	Tôi khỏe, cảm ơn bạn.	Not too bad, how about you?	Không tệ lắm, còn bạn?	I feel great today!	Hôm nay tôi cảm thấy tuyệt!	1
f9b77c4d-e3d7-4df3-b29e-7f8a9c166774	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	What is your name?	Tên của bạn là gì?	My name is John.	Tên tôi là John.	I am Sarah.	Tôi là Sarah.	You can call me Mike.	Bạn có thể gọi tôi là Mike.	2
d093b06e-b3f6-4c7f-aaed-4b838748c4aa	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	Where are you from?	Bạn đến từ đâu?	I am from Vietnam.	Tôi đến từ Việt Nam.	I come from the United States.	Tôi đến từ Mỹ.	I was born in London.	Tôi sinh ra ở London.	3
d916a145-751e-425e-ac48-696f1a512fc9	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	Nice to meet you!	Rất vui được gặp bạn!	Nice to meet you too.	Tôi cũng rất vui được gặp bạn.	Likewise.	Tôi cũng vậy.	It is a pleasure meeting you.	Rất hân hạnh được gặp bạn.	4
7a401828-e416-4f98-bd6b-08758a510826	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	How old are you?	Bạn bao nhiêu tuổi?	I am twenty years old.	Tôi hai mươi tuổi.	I just turned eighteen.	Tôi vừa mới mười tám tuổi.	I am in my mid-twenties.	Tôi khoảng giữa tuổi hai mươi.	5
bf757bb2-9089-4935-a8da-dfc80b1590b6	f7c7bb21-bfad-4d5f-9057-aa493a6a2116	See you later!	Hẹn gặp lại nhé!	See you soon!	Hẹn gặp lại sớm!	Take care!	Bảo trọng nhé!	Goodbye, have a nice day!	Tạm biệt, chúc một ngày tốt lành!	6
9447a5a9-b62e-4934-950c-a84663561683	d3c02bda-d397-43f2-8b34-305067ac0b6d	Tell me about yourself.	Hãy kể về bạn.	I am a student from Vietnam.	Tôi là sinh viên đến từ Việt Nam.	I work as a teacher.	Tôi làm giáo viên.	I love traveling and reading.	Tôi thích đi du lịch và đọc sách.	1
fc4e72af-a9c8-4108-b68e-0aa82597128d	d3c02bda-d397-43f2-8b34-305067ac0b6d	What do you do for a living?	Bạn làm nghề gì?	I am a software engineer.	Tôi là kỹ sư phần mềm.	I work in marketing.	Tôi làm trong lĩnh vực marketing.	I am still a student.	Tôi vẫn còn là sinh viên.	2
9d921125-697c-4720-b67c-65282623dbb0	d3c02bda-d397-43f2-8b34-305067ac0b6d	Do you have any brothers or sisters?	Bạn có anh chị em không?	I have one older brother.	Tôi có một anh trai.	I have two younger sisters.	Tôi có hai em gái.	No, I am an only child.	Không, tôi là con một.	3
49ff575a-0687-44cd-9186-7105118a1901	d3c02bda-d397-43f2-8b34-305067ac0b6d	Where do you live?	Bạn sống ở đâu?	I live in Ho Chi Minh City.	Tôi sống ở Thành phố Hồ Chí Minh.	I live in a small town.	Tôi sống ở một thị trấn nhỏ.	I recently moved to Hanoi.	Tôi mới chuyển đến Hà Nội.	4
a232a2c6-2395-49b3-9e8b-a3f7d152aa81	d3c02bda-d397-43f2-8b34-305067ac0b6d	What are your hobbies?	Sở thích của bạn là gì?	I enjoy cooking and swimming.	Tôi thích nấu ăn và bơi lội.	I like playing video games.	Tôi thích chơi game.	I love listening to music.	Tôi thích nghe nhạc.	5
5923f43b-598b-4866-a52c-8fe3917f03a5	b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	Are you ready to order?	Bạn đã sẵn sàng gọi món chưa?	Yes, I will have the steak.	Vâng, tôi sẽ dùng bò bít tết.	Not yet, I need a few more minutes.	Chưa, cho tôi thêm vài phút.	Can you recommend something?	Bạn có thể gợi ý gì không?	1
5f1aed3a-701b-437c-bb60-082a36c4bc4a	b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	What would you like to drink?	Bạn muốn uống gì?	Just water, please.	Cho tôi nước lọc.	I would like a cup of coffee.	Tôi muốn một ly cà phê.	Can I get some orange juice?	Cho tôi nước cam được không?	2
cb864b93-21e3-4d41-8a12-03f09adc0565	b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	How is your food?	Thức ăn thế nào?	It is delicious, thank you.	Rất ngon, cảm ơn.	It tastes amazing!	Nó ngon tuyệt vời!	It is a little too salty.	Nó hơi mặn một chút.	3
9eb50a27-4497-4b1d-aa8b-161d98b8b3d8	b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	Would you like some dessert?	Bạn có muốn tráng miệng không?	No thank you, I am full.	Không cảm ơn, tôi no rồi.	Yes, I will have the cheesecake.	Vâng, cho tôi bánh phô mai.	What desserts do you have?	Có những loại tráng miệng nào?	4
9fe12a59-d65b-4f2f-be00-d2bcb61c147b	b9dca3c1-75ad-426c-9b3e-76db3df5b9a2	Can I get the check, please?	Cho tôi xin hóa đơn.	Sure, here is your bill.	Được, đây là hóa đơn của bạn.	Would you like to pay by card?	Bạn muốn thanh toán bằng thẻ không?	Are you paying together or separately?	Bạn thanh toán chung hay riêng?	5
b987a6c2-a4c4-49d2-a4ad-e80d1a582d10	eb5ed411-41ff-4422-bae2-1b551e4cc00e	Excuse me, how do I get to the train station?	Xin lỗi, làm sao để đến ga tàu?	Go straight and turn left at the traffic light.	Đi thẳng rồi rẽ trái ở đèn giao thông.	It is about ten minutes by walking.	Đi bộ khoảng mười phút.	Take the bus number five.	Đi xe buýt số năm.	1
dda91361-8898-4bef-b471-d70f24cae433	eb5ed411-41ff-4422-bae2-1b551e4cc00e	Is there a pharmacy nearby?	Có nhà thuốc nào gần đây không?	Yes, there is one on the corner.	Có, có một nhà thuốc ở góc đường.	The nearest one is two blocks away.	Nhà thuốc gần nhất cách hai dãy nhà.	I am not sure, you can ask someone else.	Tôi không chắc, bạn hỏi người khác nhé.	2
d5a1f4a9-e87e-4a51-9dc4-1a31eb528f87	eb5ed411-41ff-4422-bae2-1b551e4cc00e	How far is the airport from here?	Sân bay cách đây bao xa?	It is about thirty kilometers.	Khoảng ba mươi ki-lô-mét.	You can get there in forty minutes by taxi.	Bạn có thể đến đó trong bốn mươi phút bằng taxi.	It takes one hour by bus.	Đi xe buýt mất một tiếng.	3
c988f125-ace1-4302-9766-c9a41d40aef3	eb5ed411-41ff-4422-bae2-1b551e4cc00e	Can you show me on the map?	Bạn có thể chỉ trên bản đồ không?	Sure, we are here and you need to go there.	Được, chúng ta đang ở đây và bạn cần đi đến kia.	Let me look it up for you.	Để tôi tìm giúp bạn.	Sorry, I do not have a map.	Xin lỗi, tôi không có bản đồ.	4
58f8e16b-e407-4bb6-b6e9-8ba093c39f14	eb5ed411-41ff-4422-bae2-1b551e4cc00e	Which bus goes to the city center?	Xe buýt nào đi đến trung tâm thành phố?	Bus number seven goes there.	Xe buýt số bảy đi đến đó.	You should take the subway instead.	Bạn nên đi tàu điện ngầm.	Any bus from this stop will take you there.	Bất kỳ xe buýt nào từ trạm này đều đến đó.	5
338fcb41-b324-4bdb-a96e-b4addddbd04b	401e2660-0deb-41d5-a1d4-21e546fdff31	Can I help you find something?	Tôi có thể giúp bạn tìm gì không?	Yes, I am looking for a pair of shoes.	Vâng, tôi đang tìm một đôi giày.	No thanks, I am just browsing.	Không, cảm ơn, tôi chỉ xem thôi.	Do you have this in a smaller size?	Bạn có cái này cỡ nhỏ hơn không?	1
793c11cd-42d2-4887-a063-03d95173ac94	401e2660-0deb-41d5-a1d4-21e546fdff31	How much does this cost?	Cái này giá bao nhiêu?	It is twenty dollars.	Nó giá hai mươi đô la.	Let me check the price for you.	Để tôi kiểm tra giá cho bạn.	It is on sale for half price.	Đang giảm giá còn một nửa.	2
d35edc47-cfb1-41a5-978a-af551ece220b	401e2660-0deb-41d5-a1d4-21e546fdff31	Do you accept credit cards?	Bạn có nhận thẻ tín dụng không?	Yes, we accept all major credit cards.	Vâng, chúng tôi nhận mọi loại thẻ tín dụng.	Sorry, we only accept cash.	Xin lỗi, chúng tôi chỉ nhận tiền mặt.	We also accept mobile payment.	Chúng tôi cũng nhận thanh toán di động.	3
dda01176-249a-4be7-be17-9bc984bdd73b	401e2660-0deb-41d5-a1d4-21e546fdff31	Can I try this on?	Tôi có thể thử cái này không?	Of course, the fitting room is over there.	Tất nhiên, phòng thử đồ ở đằng kia.	Sure, what size do you need?	Được, bạn cần cỡ bao nhiêu?	Yes, there is a mirror inside.	Vâng, bên trong có gương.	4
cbca83da-acc7-45d8-b1d0-42c450c1672a	401e2660-0deb-41d5-a1d4-21e546fdff31	I would like to return this item.	Tôi muốn trả lại món hàng này.	Do you have the receipt?	Bạn có hóa đơn không?	What is the reason for the return?	Lý do trả hàng là gì?	We can exchange it for another one.	Chúng tôi có thể đổi cho bạn cái khác.	5
83ef5f77-a129-46d0-aad7-c8fec54eea44	add4d9ce-4642-45a9-a254-f380d3204358	What do you like to do in your free time?	Bạn thích làm gì khi rảnh?	I enjoy reading books.	Tôi thích đọc sách.	I love playing soccer.	Tôi thích chơi bóng đá.	I usually watch movies.	Tôi thường xem phim.	1
296cbd57-2b0a-4db1-a103-99c73ddd880e	add4d9ce-4642-45a9-a254-f380d3204358	Do you play any sports?	Bạn có chơi thể thao không?	I play basketball every weekend.	Tôi chơi bóng rổ mỗi cuối tuần.	I go jogging every morning.	Tôi chạy bộ mỗi sáng.	Not really, but I like watching sports.	Không hẳn, nhưng tôi thích xem thể thao.	2
3f68f050-ee80-4225-a20f-0da35aadd015	add4d9ce-4642-45a9-a254-f380d3204358	What kind of music do you like?	Bạn thích thể loại nhạc nào?	I listen to pop music.	Tôi nghe nhạc pop.	I am a big fan of rock.	Tôi rất thích nhạc rock.	I prefer classical music.	Tôi thích nhạc cổ điển hơn.	3
ee9e5b8e-289a-4598-ab80-7322d8d7ce59	add4d9ce-4642-45a9-a254-f380d3204358	Have you seen any good movies lately?	Dạo này bạn xem phim nào hay không?	Yes, I watched a great action movie.	Có, tôi xem một phim hành động rất hay.	Not really, I have been busy.	Không, dạo này tôi bận lắm.	I just saw a funny comedy.	Tôi vừa xem một phim hài rất vui.	4
8ad82363-68ab-41ac-b55d-cafe0eb1555a	add4d9ce-4642-45a9-a254-f380d3204358	Do you like cooking?	Bạn có thích nấu ăn không?	Yes, I cook dinner every day.	Có, tôi nấu bữa tối mỗi ngày.	I love trying new recipes.	Tôi thích thử các công thức mới.	Not really, I prefer eating out.	Không, tôi thích ăn ngoài hơn.	5
466aef5e-4e99-4679-886b-b32f19b9f7e7	24cb48d7-066b-4334-8604-62712620008c	What seems to be the problem?	Vấn đề của bạn là gì?	I have a terrible headache.	Tôi bị đau đầu kinh khủng.	I have been coughing for three days.	Tôi bị ho ba ngày rồi.	My stomach hurts a lot.	Bụng tôi đau lắm.	1
ce49efcb-3e68-49ed-a911-80b01a337539	24cb48d7-066b-4334-8604-62712620008c	How long have you been feeling this way?	Bạn bị như vậy bao lâu rồi?	Since yesterday morning.	Từ sáng hôm qua.	About a week now.	Khoảng một tuần rồi.	It just started today.	Vừa mới bắt đầu hôm nay.	2
9f35ce31-bc73-4818-b24d-0ca0f2713098	24cb48d7-066b-4334-8604-62712620008c	Are you allergic to any medicine?	Bạn có dị ứng thuốc nào không?	No, I am not allergic to anything.	Không, tôi không dị ứng gì.	Yes, I am allergic to penicillin.	Có, tôi dị ứng với penicillin.	I am not sure, let me check.	Tôi không chắc, để tôi kiểm tra.	3
25f592bf-34fa-4e5d-85d3-3ab4434f04fd	24cb48d7-066b-4334-8604-62712620008c	Do you have health insurance?	Bạn có bảo hiểm y tế không?	Yes, here is my insurance card.	Có, đây là thẻ bảo hiểm của tôi.	No, I will pay out of pocket.	Không, tôi sẽ tự trả tiền.	I have travel insurance only.	Tôi chỉ có bảo hiểm du lịch.	4
beb72290-9035-4e21-af00-26cc518d166d	24cb48d7-066b-4334-8604-62712620008c	You need to take this medicine twice a day.	Bạn cần uống thuốc này hai lần mỗi ngày.	Should I take it before or after meals?	Tôi nên uống trước hay sau bữa ăn?	How many days should I take it?	Tôi nên uống trong bao nhiêu ngày?	Are there any side effects?	Có tác dụng phụ nào không?	5
ffce8984-301a-4985-9474-b4c7933d23b0	be4dc1b9-34a6-4313-aa51-7b1340e2260b	I would like to book a hotel room.	Tôi muốn đặt phòng khách sạn.	For how many nights?	Bạn đặt mấy đêm?	Single or double room?	Phòng đơn hay phòng đôi?	When would you like to check in?	Bạn muốn nhận phòng khi nào?	1
5c85502d-b4ad-4810-8a30-1f2e91083733	be4dc1b9-34a6-4313-aa51-7b1340e2260b	What time does the flight depart?	Chuyến bay khởi hành lúc mấy giờ?	It departs at ten in the morning.	Nó khởi hành lúc mười giờ sáng.	Your flight leaves at three PM.	Chuyến bay của bạn cất cánh lúc ba giờ chiều.	Please check your boarding pass.	Vui lòng kiểm tra thẻ lên máy bay.	2
380d54c2-f19d-4a34-b211-9c8736610357	be4dc1b9-34a6-4313-aa51-7b1340e2260b	Can you recommend a good restaurant?	Bạn gợi ý nhà hàng nào ngon không?	There is a great seafood place nearby.	Có một quán hải sản ngon gần đây.	I recommend the Italian restaurant on Main Street.	Tôi giới thiệu nhà hàng Ý trên phố chính.	You should try the local street food.	Bạn nên thử đồ ăn đường phố địa phương.	3
3e069c74-8224-471d-b3d3-9eeb5b3ee5a5	be4dc1b9-34a6-4313-aa51-7b1340e2260b	How much is the entrance fee?	Vé vào cửa bao nhiêu?	It is free for children under twelve.	Miễn phí cho trẻ dưới mười hai tuổi.	The ticket costs ten dollars per person.	Vé mười đô la mỗi người.	Students get a fifty percent discount.	Sinh viên được giảm năm mươi phần trăm.	4
75f421f2-c31d-410a-8838-15be9e26ed06	be4dc1b9-34a6-4313-aa51-7b1340e2260b	What is the best time to visit this place?	Thời điểm nào tốt nhất để đến đây?	Spring is the best season to visit.	Mùa xuân là mùa đẹp nhất để đến.	I recommend coming in the morning.	Tôi khuyên nên đến vào buổi sáng.	Avoid the rainy season if possible.	Tránh mùa mưa nếu có thể.	5
56ef7aee-abfe-484d-b0ac-c0b31c138e94	9bbb60b0-8850-4d9a-adc3-ac63668092e8	What do you do for work?	Bạn làm công việc gì?	I work as an accountant.	Tôi làm kế toán.	I am a freelance designer.	Tôi là nhà thiết kế tự do.	I run my own small business.	Tôi tự kinh doanh nhỏ.	1
81688843-0ca4-4534-90b8-0aec6582ae0f	9bbb60b0-8850-4d9a-adc3-ac63668092e8	How long have you been working there?	Bạn đã làm ở đó bao lâu?	I have been there for three years.	Tôi đã làm ở đó ba năm.	I just started last month.	Tôi mới bắt đầu tháng trước.	Almost five years now.	Gần năm năm rồi.	2
04c049de-465f-43e0-a93c-4bfcdfec98b8	9bbb60b0-8850-4d9a-adc3-ac63668092e8	Do you enjoy your job?	Bạn có thích công việc không?	Yes, I love what I do.	Có, tôi yêu công việc của mình.	It is challenging but rewarding.	Nó đầy thử thách nhưng bổ ích.	Sometimes it can be stressful.	Đôi khi nó khá căng thẳng.	3
2f242373-e5ab-42ef-a6ac-cbde044614b2	9bbb60b0-8850-4d9a-adc3-ac63668092e8	What time do you finish work?	Bạn tan làm lúc mấy giờ?	I usually finish at five PM.	Tôi thường tan làm lúc năm giờ chiều.	It depends on the day.	Tùy vào từng ngày.	I work from home so my schedule is flexible.	Tôi làm việc ở nhà nên lịch linh hoạt.	4
ba319fc1-c828-47b3-a7da-53cc31cff525	9bbb60b0-8850-4d9a-adc3-ac63668092e8	Are you looking for a new job?	Bạn có đang tìm việc mới không?	Yes, I want to try something different.	Có, tôi muốn thử cái gì đó khác.	No, I am happy where I am.	Không, tôi hài lòng chỗ hiện tại.	Maybe in the future.	Có thể trong tương lai.	5
ffbbd953-8a1e-4d95-9521-e083c4948316	f375bb3e-c3fb-45a8-92f6-ab43b5061ae6	What is the weather like today?	Hôm nay thời tiết thế nào?	It is sunny and warm.	Trời nắng và ấm.	It is cloudy and a bit cold.	Trời nhiều mây và hơi lạnh.	It looks like it is going to rain.	Trông có vẻ sắp mưa.	1
7019d984-2c85-448d-b9bd-012805e831ca	f375bb3e-c3fb-45a8-92f6-ab43b5061ae6	Do you like rainy days?	Bạn có thích ngày mưa không?	Yes, I find them relaxing.	Có, tôi thấy chúng thư giãn.	Not really, I prefer sunny weather.	Không, tôi thích thời tiết nắng hơn.	Only when I am staying at home.	Chỉ khi tôi ở nhà.	2
5ffbdec9-4612-4ddd-8a5f-894e745316af	f375bb3e-c3fb-45a8-92f6-ab43b5061ae6	What is your favorite season?	Mùa yêu thích của bạn là gì?	I love autumn because of the cool weather.	Tôi thích mùa thu vì thời tiết mát mẻ.	Summer is my favorite season.	Mùa hè là mùa tôi thích nhất.	I enjoy spring the most.	Tôi thích mùa xuân nhất.	3
6cb48888-e23d-4893-a331-0211da27e47a	f375bb3e-c3fb-45a8-92f6-ab43b5061ae6	Is it always this hot here?	Ở đây luôn nóng thế này sao?	Yes, it is hot all year round.	Vâng, nóng quanh năm.	No, it gets cooler in winter.	Không, mùa đông sẽ mát hơn.	This is unusually hot for this time of year.	Thời điểm này năm nay nóng bất thường.	4
2e20508d-bdbd-4cec-8dfa-97e0adbd6573	f375bb3e-c3fb-45a8-92f6-ab43b5061ae6	Should I bring an umbrella?	Tôi có nên mang ô không?	Yes, it might rain this afternoon.	Có, chiều nay có thể mưa.	No, the forecast says it will be clear.	Không, dự báo nói trời sẽ quang.	Just in case, you should bring one.	Phòng khi, bạn nên mang theo.	5
\.


--
-- Data for Name: userachievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userachievements (userid, achievementid, unlockedat) FROM stdin;
\.


--
-- Data for Name: usercollections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usercollections (id, userid, name, description, createdat) FROM stdin;
\.


--
-- Data for Name: usercollectionwords; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usercollectionwords (id, collectionid, dictionaryentryid, customword, custommeaning, customexample, addedat) FROM stdin;
\.


--
-- Data for Name: usergameprogress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usergameprogress (id, userid, levelid, score, stars, iscompleted, besttime, attempts, completedat) FROM stdin;
\.


--
-- Data for Name: userprogress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userprogress (id, userid, lessonid, status, score) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, passwordhash, role, levelid, isactive, createdat) FROM stdin;
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	philong	culitete@gmail.com	$2a$10$.OrVNcBONA8Mjn1a8FCY7./wRZmtcuCybNDkUBcWNbL4Js3bodlRm	user	\N	t	2026-05-11 10:37:31.936624
22227f57-0aa9-4da0-b6ac-cfd00110b514	testuser_gemini	testuser_gemini@example.com	$2a$10$C7hAmcq0OG.anoJycEN2P.V9kiVN9lmQxcElLZfLz0EqQpzSS2ouu	user	\N	t	2026-05-11 10:57:55.45399
63067d89-05de-4a11-9fe9-1fba5b52ea9e	superadmin	superadmin@system.com	$2a$10$ky8AGBo.xvidPAN79So9GOWk5ne6z3BhSOnm5TUomsKDmDUrwQPN.	superadmin	\N	t	2026-05-11 18:40:55.960678
\.


--
-- Data for Name: userstats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userstats (userid, exp, level, streakdays, lastlogin) FROM stdin;
22227f57-0aa9-4da0-b6ac-cfd00110b514	0	1	0	2026-05-11 10:57:55.515252
f7ba7c39-ecfb-4b7e-aca2-23bd434ca863	260	2	0	2026-05-12 08:11:08.463328
63067d89-05de-4a11-9fe9-1fba5b52ea9e	60	1	1	2026-05-12 08:17:49.18353
\.


--
-- Data for Name: uservocabulary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uservocabulary (userid, vocabid, status) FROM stdin;
\.


--
-- Data for Name: vocabulary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vocabulary (id, word, meaning, example, audiourl, imageurl) FROM stdin;
\.


--
-- Data for Name: writingexercises; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Data for Name: writinglessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.writinglessons (id, title, description, orderindex, createdat) FROM stdin;
689823c2-883f-4eec-9dce-f93820865502	Giới thiệu bản thân	Viết các câu cơ bản giới thiệu về bản thân	1	2026-05-11 11:31:33.260603
69ea9e12-4230-45a7-ab24-53bf55c1ce99	Sở thích cá nhân	Mô tả những điều bạn thích làm	2	2026-05-11 11:31:33.272892
601a2a94-3816-46bc-b46e-95b00a6884d5	Email công việc	Các mẫu câu thông dụng trong email	3	2026-05-11 11:31:33.282802
\.


--
-- Data for Name: writingprogress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.writingprogress (userid, lessonid, status, score, updatedat) FROM stdin;
\.


--
-- Data for Name: writingvocab; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Name: grammarcategories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grammarcategories_id_seq', 49, true);


--
-- Name: learninglevels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.learninglevels_id_seq', 3, true);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: dictionaryentries dictionaryentries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionaryentries
    ADD CONSTRAINT dictionaryentries_pkey PRIMARY KEY (id);


--
-- Name: dictionarysearchhistory dictionarysearchhistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionarysearchhistory
    ADD CONSTRAINT dictionarysearchhistory_pkey PRIMARY KEY (id);


--
-- Name: dictionarysynonyms dictionarysynonyms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionarysynonyms
    ADD CONSTRAINT dictionarysynonyms_pkey PRIMARY KEY (id);


--
-- Name: gamelevels gamelevels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gamelevels
    ADD CONSTRAINT gamelevels_pkey PRIMARY KEY (id);


--
-- Name: gamesets gamesets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gamesets
    ADD CONSTRAINT gamesets_pkey PRIMARY KEY (id);


--
-- Name: grammarcategories grammarcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grammarcategories
    ADD CONSTRAINT grammarcategories_pkey PRIMARY KEY (id);


--
-- Name: grammarquiz grammarquiz_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grammarquiz
    ADD CONSTRAINT grammarquiz_pkey PRIMARY KEY (id);


--
-- Name: grammartopics grammartopics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grammartopics
    ADD CONSTRAINT grammartopics_pkey PRIMARY KEY (id);


--
-- Name: learninglevels learninglevels_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.learninglevels
    ADD CONSTRAINT learninglevels_code_key UNIQUE (code);


--
-- Name: learninglevels learninglevels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.learninglevels
    ADD CONSTRAINT learninglevels_pkey PRIMARY KEY (id);


--
-- Name: lessonmedia lessonmedia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessonmedia
    ADD CONSTRAINT lessonmedia_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: lessonvocabulary lessonvocabulary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessonvocabulary
    ADD CONSTRAINT lessonvocabulary_pkey PRIMARY KEY (lessonid, vocabid);


--
-- Name: minigamequestions minigamequestions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.minigamequestions
    ADD CONSTRAINT minigamequestions_pkey PRIMARY KEY (id);


--
-- Name: quiz quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz
    ADD CONSTRAINT quiz_pkey PRIMARY KEY (id);


--
-- Name: quizoptions quizoptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizoptions
    ADD CONSTRAINT quizoptions_pkey PRIMARY KEY (id);


--
-- Name: speakinglessons speakinglessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.speakinglessons
    ADD CONSTRAINT speakinglessons_pkey PRIMARY KEY (id);


--
-- Name: speakingprogress speakingprogress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.speakingprogress
    ADD CONSTRAINT speakingprogress_pkey PRIMARY KEY (userid, lessonid);


--
-- Name: speakingquestions speakingquestions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.speakingquestions
    ADD CONSTRAINT speakingquestions_pkey PRIMARY KEY (id);


--
-- Name: usergameprogress uq_ugp_user_level; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergameprogress
    ADD CONSTRAINT uq_ugp_user_level UNIQUE (userid, levelid);


--
-- Name: userachievements userachievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userachievements
    ADD CONSTRAINT userachievements_pkey PRIMARY KEY (userid, achievementid);


--
-- Name: usercollections usercollections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usercollections
    ADD CONSTRAINT usercollections_pkey PRIMARY KEY (id);


--
-- Name: usercollectionwords usercollectionwords_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usercollectionwords
    ADD CONSTRAINT usercollectionwords_pkey PRIMARY KEY (id);


--
-- Name: usergameprogress usergameprogress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergameprogress
    ADD CONSTRAINT usergameprogress_pkey PRIMARY KEY (id);


--
-- Name: userprogress userprogress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userprogress
    ADD CONSTRAINT userprogress_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: userstats userstats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userstats
    ADD CONSTRAINT userstats_pkey PRIMARY KEY (userid);


--
-- Name: uservocabulary uservocabulary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uservocabulary
    ADD CONSTRAINT uservocabulary_pkey PRIMARY KEY (userid, vocabid);


--
-- Name: vocabulary vocabulary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vocabulary
    ADD CONSTRAINT vocabulary_pkey PRIMARY KEY (id);


--
-- Name: writingexercises writingexercises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.writingexercises
    ADD CONSTRAINT writingexercises_pkey PRIMARY KEY (id);


--
-- Name: writinglessons writinglessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.writinglessons
    ADD CONSTRAINT writinglessons_pkey PRIMARY KEY (id);


--
-- Name: writingprogress writingprogress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.writingprogress
    ADD CONSTRAINT writingprogress_pkey PRIMARY KEY (userid, lessonid);


--
-- Name: writingvocab writingvocab_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.writingvocab
    ADD CONSTRAINT writingvocab_pkey PRIMARY KEY (id);


--
-- Name: idx_course_level; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_course_level ON public.courses USING btree (levelid);


--
-- Name: idx_dictionary_level; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_dictionary_level ON public.dictionaryentries USING btree (levelid);


--
-- Name: idx_dictionary_word; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_dictionary_word ON public.dictionaryentries USING btree (word);


--
-- Name: idx_lesson_level; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lesson_level ON public.lessons USING btree (levelid);


--
-- Name: idx_media_lesson; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_lesson ON public.lessonmedia USING btree (lessonid);


--
-- Name: idx_progress_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_progress_user ON public.userprogress USING btree (userid);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_email ON public.users USING btree (email);


--
-- Name: idx_vocab_word; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vocab_word ON public.vocabulary USING btree (word);


--
-- Name: courses courses_createdby_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_createdby_fkey FOREIGN KEY (createdby) REFERENCES public.users(id);


--
-- Name: courses courses_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_levelid_fkey FOREIGN KEY (levelid) REFERENCES public.learninglevels(id);


--
-- Name: dictionaryentries dictionaryentries_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionaryentries
    ADD CONSTRAINT dictionaryentries_levelid_fkey FOREIGN KEY (levelid) REFERENCES public.learninglevels(id);


--
-- Name: dictionarysearchhistory dictionarysearchhistory_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionarysearchhistory
    ADD CONSTRAINT dictionarysearchhistory_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: dictionarysynonyms dictionarysynonyms_wordid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionarysynonyms
    ADD CONSTRAINT dictionarysynonyms_wordid_fkey FOREIGN KEY (wordid) REFERENCES public.dictionaryentries(id);


--
-- Name: gamelevels gamelevels_setid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gamelevels
    ADD CONSTRAINT gamelevels_setid_fkey FOREIGN KEY (setid) REFERENCES public.gamesets(id);


--
-- Name: grammarquiz grammarquiz_topicid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grammarquiz
    ADD CONSTRAINT grammarquiz_topicid_fkey FOREIGN KEY (topicid) REFERENCES public.grammartopics(id);


--
-- Name: grammartopics grammartopics_categoryid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grammartopics
    ADD CONSTRAINT grammartopics_categoryid_fkey FOREIGN KEY (categoryid) REFERENCES public.grammarcategories(id);


--
-- Name: lessonmedia lessonmedia_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessonmedia
    ADD CONSTRAINT lessonmedia_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.lessons(id);


--
-- Name: lessons lessons_courseid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_courseid_fkey FOREIGN KEY (courseid) REFERENCES public.courses(id);


--
-- Name: lessons lessons_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_levelid_fkey FOREIGN KEY (levelid) REFERENCES public.learninglevels(id);


--
-- Name: lessonvocabulary lessonvocabulary_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessonvocabulary
    ADD CONSTRAINT lessonvocabulary_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.lessons(id);


--
-- Name: lessonvocabulary lessonvocabulary_vocabid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessonvocabulary
    ADD CONSTRAINT lessonvocabulary_vocabid_fkey FOREIGN KEY (vocabid) REFERENCES public.vocabulary(id);


--
-- Name: minigamequestions minigamequestions_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.minigamequestions
    ADD CONSTRAINT minigamequestions_levelid_fkey FOREIGN KEY (levelid) REFERENCES public.gamelevels(id);


--
-- Name: quiz quiz_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz
    ADD CONSTRAINT quiz_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.lessons(id);


--
-- Name: quizoptions quizoptions_quizid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizoptions
    ADD CONSTRAINT quizoptions_quizid_fkey FOREIGN KEY (quizid) REFERENCES public.quiz(id);


--
-- Name: speakingquestions speakingquestions_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.speakingquestions
    ADD CONSTRAINT speakingquestions_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.speakinglessons(id) ON DELETE CASCADE;


--
-- Name: userachievements userachievements_achievementid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userachievements
    ADD CONSTRAINT userachievements_achievementid_fkey FOREIGN KEY (achievementid) REFERENCES public.achievements(id);


--
-- Name: userachievements userachievements_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userachievements
    ADD CONSTRAINT userachievements_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: usercollections usercollections_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usercollections
    ADD CONSTRAINT usercollections_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: usercollectionwords usercollectionwords_collectionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usercollectionwords
    ADD CONSTRAINT usercollectionwords_collectionid_fkey FOREIGN KEY (collectionid) REFERENCES public.usercollections(id);


--
-- Name: usercollectionwords usercollectionwords_dictionaryentryid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usercollectionwords
    ADD CONSTRAINT usercollectionwords_dictionaryentryid_fkey FOREIGN KEY (dictionaryentryid) REFERENCES public.dictionaryentries(id);


--
-- Name: usergameprogress usergameprogress_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergameprogress
    ADD CONSTRAINT usergameprogress_levelid_fkey FOREIGN KEY (levelid) REFERENCES public.gamelevels(id);


--
-- Name: usergameprogress usergameprogress_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergameprogress
    ADD CONSTRAINT usergameprogress_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: userprogress userprogress_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userprogress
    ADD CONSTRAINT userprogress_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.lessons(id);


--
-- Name: userprogress userprogress_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userprogress
    ADD CONSTRAINT userprogress_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: users users_levelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_levelid_fkey FOREIGN KEY (levelid) REFERENCES public.learninglevels(id);


--
-- Name: userstats userstats_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userstats
    ADD CONSTRAINT userstats_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: uservocabulary uservocabulary_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uservocabulary
    ADD CONSTRAINT uservocabulary_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: uservocabulary uservocabulary_vocabid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uservocabulary
    ADD CONSTRAINT uservocabulary_vocabid_fkey FOREIGN KEY (vocabid) REFERENCES public.vocabulary(id);


--
-- Name: writingexercises writingexercises_lessonid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.writingexercises
    ADD CONSTRAINT writingexercises_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.writinglessons(id) ON DELETE CASCADE;


--
-- Name: writingvocab writingvocab_exerciseid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.writingvocab
    ADD CONSTRAINT writingvocab_exerciseid_fkey FOREIGN KEY (exerciseid) REFERENCES public.writingexercises(id) ON DELETE CASCADE;


--
--
-- Application schema supplements
-- These statements keep the dump aligned with the current Node.js backend.
--

ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS avatarurl text,
    ADD COLUMN IF NOT EXISTS plan character varying(20) DEFAULT 'free'::character varying,
    ADD COLUMN IF NOT EXISTS plusexpiresat timestamp without time zone;

ALTER TABLE public.writinglessons
    ADD COLUMN IF NOT EXISTS passageen text,
    ADD COLUMN IF NOT EXISTS passagevi text;

CREATE TABLE IF NOT EXISTS public.paymentrequests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid NOT NULL,
    plan character varying(20) DEFAULT 'plus'::character varying NOT NULL,
    amount integer NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    transfercontent character varying(120) NOT NULL,
    gateway character varying(40) DEFAULT 'sepay'::character varying NOT NULL,
    sepaytransactionid character varying(80),
    rawpayload jsonb,
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    completedat timestamp without time zone,
    CONSTRAINT paymentrequests_pkey PRIMARY KEY (id),
    CONSTRAINT paymentrequests_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_requests_transfer_content
    ON public.paymentrequests USING btree (transfercontent);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_requests_sepay_transaction
    ON public.paymentrequests USING btree (sepaytransactionid)
    WHERE (sepaytransactionid IS NOT NULL);

CREATE TABLE IF NOT EXISTS public.listeninglessons (
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
    CONSTRAINT listeninglessons_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.listeningsegments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid NOT NULL,
    speaker character varying(120),
    text text NOT NULL,
    orderindex integer DEFAULT 0,
    speakerid uuid,
    CONSTRAINT listeningsegments_pkey PRIMARY KEY (id),
    CONSTRAINT listeningsegments_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.listeninglessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.listeningspeakers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid NOT NULL,
    name character varying(120) NOT NULL,
    gender character varying(20) DEFAULT 'female'::character varying,
    voicename character varying(180),
    voiceuri character varying(255),
    orderindex integer DEFAULT 0,
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now(),
    CONSTRAINT listeningspeakers_pkey PRIMARY KEY (id),
    CONSTRAINT listeningspeakers_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.listeninglessons(id) ON DELETE CASCADE
);

ALTER TABLE public.listeningsegments
    DROP CONSTRAINT IF EXISTS listeningsegments_speakerid_fkey,
    ADD CONSTRAINT listeningsegments_speakerid_fkey FOREIGN KEY (speakerid) REFERENCES public.listeningspeakers(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.listeningvocabulary (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid NOT NULL,
    word character varying(120) NOT NULL,
    meaning character varying(255),
    orderindex integer DEFAULT 0,
    CONSTRAINT listeningvocabulary_pkey PRIMARY KEY (id),
    CONSTRAINT listeningvocabulary_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.listeninglessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.listeningquestions (
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
    orderindex integer DEFAULT 0,
    CONSTRAINT listeningquestions_pkey PRIMARY KEY (id),
    CONSTRAINT listeningquestions_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.listeninglessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.listeningprogress (
    userid uuid NOT NULL,
    lessonid uuid NOT NULL,
    status character varying(50) DEFAULT 'in_progress'::character varying,
    score double precision,
    updatedat timestamp with time zone DEFAULT now(),
    CONSTRAINT listeningprogress_pkey PRIMARY KEY (userid, lessonid),
    CONSTRAINT listeningprogress_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT listeningprogress_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.listeninglessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.readinglessons (
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
    CONSTRAINT readinglessons_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.readingparagraphs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid NOT NULL,
    content text NOT NULL,
    orderindex integer DEFAULT 0,
    CONSTRAINT readingparagraphs_pkey PRIMARY KEY (id),
    CONSTRAINT readingparagraphs_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.readinglessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.readingvocabulary (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lessonid uuid NOT NULL,
    word character varying(120) NOT NULL,
    meaning character varying(255),
    orderindex integer DEFAULT 0,
    CONSTRAINT readingvocabulary_pkey PRIMARY KEY (id),
    CONSTRAINT readingvocabulary_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.readinglessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.readingquestions (
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
    orderindex integer DEFAULT 0,
    CONSTRAINT readingquestions_pkey PRIMARY KEY (id),
    CONSTRAINT readingquestions_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.readinglessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.readingprogress (
    userid uuid NOT NULL,
    lessonid uuid NOT NULL,
    status character varying(50) DEFAULT 'in_progress'::character varying,
    score double precision,
    updatedat timestamp with time zone DEFAULT now(),
    CONSTRAINT readingprogress_pkey PRIMARY KEY (userid, lessonid),
    CONSTRAINT readingprogress_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT readingprogress_lessonid_fkey FOREIGN KEY (lessonid) REFERENCES public.readinglessons(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_listening_lessons_order ON public.listeninglessons USING btree (orderindex);
CREATE INDEX IF NOT EXISTS idx_listeningsegments_lesson ON public.listeningsegments USING btree (lessonid, orderindex);
CREATE INDEX IF NOT EXISTS idx_listening_speakers_lesson ON public.listeningspeakers USING btree (lessonid, orderindex);
CREATE INDEX IF NOT EXISTS idx_listening_segments_speaker ON public.listeningsegments USING btree (speakerid);
CREATE INDEX IF NOT EXISTS idx_listening_questions_lesson ON public.listeningquestions USING btree (lessonid, orderindex);
CREATE INDEX IF NOT EXISTS idx_listening_vocab_lesson ON public.listeningvocabulary USING btree (lessonid, orderindex);
CREATE INDEX IF NOT EXISTS idx_reading_lessons_order ON public.readinglessons USING btree (orderindex);
CREATE INDEX IF NOT EXISTS idx_readingparagraphs_lesson ON public.readingparagraphs USING btree (lessonid, orderindex);
CREATE INDEX IF NOT EXISTS idx_reading_questions_lesson ON public.readingquestions USING btree (lessonid, orderindex);
CREATE INDEX IF NOT EXISTS idx_reading_vocab_lesson ON public.readingvocabulary USING btree (lessonid, orderindex);

CREATE TABLE IF NOT EXISTS public.usererrorevents (
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
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT usererrorevents_pkey PRIMARY KEY (id),
    CONSTRAINT usererrorevents_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.userweaknesses (
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
    updatedat timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT userweaknesses_pkey PRIMARY KEY (id),
    CONSTRAINT userweaknesses_user_skill_error_key UNIQUE (userid, skill, errortype, errorkey),
    CONSTRAINT userweaknesses_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.dailytasks (
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
    CONSTRAINT dailytasks_pkey PRIMARY KEY (id),
    CONSTRAINT dailytasks_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_error_events_user_skill ON public.usererrorevents USING btree (userid, skill, createdat DESC);
CREATE INDEX IF NOT EXISTS idx_user_error_events_reference ON public.usererrorevents USING btree (referencetype, referenceid);
CREATE INDEX IF NOT EXISTS idx_user_weaknesses_user_weight ON public.userweaknesses USING btree (userid, weight DESC, lastseenat DESC);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_date ON public.dailytasks USING btree (userid, taskdate, orderindex);
CREATE UNIQUE INDEX IF NOT EXISTS uq_daily_tasks_user_date_order ON public.dailytasks USING btree (userid, taskdate, orderindex);

--
-- PostgreSQL database dump complete
--
