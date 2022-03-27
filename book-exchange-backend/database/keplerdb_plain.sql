--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

-- Started on 2022-03-24 23:23:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2908 (class 1262 OID 49227)
-- Name: keplerexchange; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE keplerexchange WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1251' LC_CTYPE = 'English_United States.1251';


\connect keplerexchange

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- TOC entry 2909 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 218 (class 1255 OID 57484)
-- Name: update_edited_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_edited_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.edited = now();
    RETURN NEW;   
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 213 (class 1259 OID 57488)
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id bigint NOT NULL,
    added time without time zone DEFAULT now() NOT NULL,
    creator_id bigint NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);


--
-- TOC entry 212 (class 1259 OID 57486)
-- Name: conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.conversations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2910 (class 0 OID 0)
-- Dependencies: 212
-- Name: conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.conversations_id_seq OWNED BY public.conversations.id;


--
-- TOC entry 209 (class 1259 OID 57452)
-- Name: listing_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listing_tags (
    id bigint NOT NULL,
    listing_id bigint NOT NULL,
    tag_id bigint NOT NULL
);


--
-- TOC entry 208 (class 1259 OID 57450)
-- Name: lisiting_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lisiting_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2911 (class 0 OID 0)
-- Dependencies: 208
-- Name: lisiting_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lisiting_tags_id_seq OWNED BY public.listing_tags.id;


--
-- TOC entry 204 (class 1259 OID 49260)
-- Name: listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listings (
    name character varying NOT NULL,
    description character varying,
    poster_id bigint NOT NULL,
    type character varying NOT NULL,
    id bigint NOT NULL,
    title_image character varying NOT NULL,
    added timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    price bigint DEFAULT 0 NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    edited timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 205 (class 1259 OID 49301)
-- Name: listings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.listings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2912 (class 0 OID 0)
-- Dependencies: 205
-- Name: listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.listings_id_seq OWNED BY public.listings.id;


--
-- TOC entry 216 (class 1259 OID 57507)
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id bigint NOT NULL,
    creator_id bigint NOT NULL,
    text character varying NOT NULL,
    added timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    conversation_id bigint NOT NULL,
    seen boolean DEFAULT false NOT NULL,
    embedded bigint,
    notification_sent boolean DEFAULT false NOT NULL,
    addressant bigint DEFAULT 0 NOT NULL
);


--
-- TOC entry 215 (class 1259 OID 57505)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2913 (class 0 OID 0)
-- Dependencies: 215
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 207 (class 1259 OID 49337)
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id bigint NOT NULL,
    text character varying NOT NULL,
    creator_id bigint NOT NULL,
    times_used bigint DEFAULT 1 NOT NULL,
    added timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 206 (class 1259 OID 49335)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2914 (class 0 OID 0)
-- Dependencies: 206
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 214 (class 1259 OID 57498)
-- Name: user_conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_conversations (
    user_id bigint NOT NULL,
    conversation_id bigint NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    id bigint NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 57519)
-- Name: user_conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_conversations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2915 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_conversations_id_seq OWNED BY public.user_conversations.id;


--
-- TOC entry 211 (class 1259 OID 57465)
-- Name: user_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_images (
    id bigint NOT NULL,
    file_name character varying NOT NULL,
    listing_id bigint NOT NULL,
    user_id bigint NOT NULL,
    added timestamp without time zone DEFAULT now() NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);


--
-- TOC entry 210 (class 1259 OID 57463)
-- Name: user_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2916 (class 0 OID 0)
-- Dependencies: 210
-- Name: user_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_images_id_seq OWNED BY public.user_images.id;


--
-- TOC entry 202 (class 1259 OID 49236)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying NOT NULL,
    first_name character varying,
    last_name character varying,
    img_link character varying
);


--
-- TOC entry 203 (class 1259 OID 49239)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2917 (class 0 OID 0)
-- Dependencies: 203
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2749 (class 2604 OID 57491)
-- Name: conversations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations ALTER COLUMN id SET DEFAULT nextval('public.conversations_id_seq'::regclass);


--
-- TOC entry 2745 (class 2604 OID 57455)
-- Name: listing_tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_tags ALTER COLUMN id SET DEFAULT nextval('public.lisiting_tags_id_seq'::regclass);


--
-- TOC entry 2736 (class 2604 OID 49303)
-- Name: listings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings ALTER COLUMN id SET DEFAULT nextval('public.listings_id_seq'::regclass);


--
-- TOC entry 2754 (class 2604 OID 57510)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 2742 (class 2604 OID 49340)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 2753 (class 2604 OID 57521)
-- Name: user_conversations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_conversations ALTER COLUMN id SET DEFAULT nextval('public.user_conversations_id_seq'::regclass);


--
-- TOC entry 2746 (class 2604 OID 57468)
-- Name: user_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_images ALTER COLUMN id SET DEFAULT nextval('public.user_images_id_seq'::regclass);


--
-- TOC entry 2735 (class 2604 OID 49241)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2771 (class 2606 OID 57494)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 2767 (class 2606 OID 57457)
-- Name: listing_tags lisiting_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_tags
    ADD CONSTRAINT lisiting_tags_pkey PRIMARY KEY (id);


--
-- TOC entry 2763 (class 2606 OID 49311)
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- TOC entry 2775 (class 2606 OID 57517)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 2765 (class 2606 OID 49346)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 2773 (class 2606 OID 57526)
-- Name: user_conversations user_conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_conversations
    ADD CONSTRAINT user_conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 2769 (class 2606 OID 57473)
-- Name: user_images user_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_images
    ADD CONSTRAINT user_images_pkey PRIMARY KEY (id);


--
-- TOC entry 2761 (class 2606 OID 49243)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2776 (class 2620 OID 57485)
-- Name: listings update_listing_edited; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_listing_edited BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.update_edited_column();


-- Completed on 2022-03-24 23:23:05

--
-- PostgreSQL database dump complete
--

