import React, {useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {companies} from './data';
import {Header, Footer} from './components';
import Home from './pages/Home';
import Group from './pages/Group';
import Companies from './pages/Companies';
import CompanyPage from './pages/CompanyPage';
import Contact from './pages/Contact';
import './styles.css';
const current = location.pathname.split('/').filter(Boolean).pop()?.replace('.html','') || 'index';
const page = current === 'demo_1' ? 'index' : current;
function App(){useEffect(()=>{const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})},{threshold:0.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));return()=>observer.disconnect()},[]);const c=companies.find(co=>co.id===page);return <><Header/><main id="contenido">{page==='index'?<Home/>:page==='grupo'?<Group/>:page==='empresas'?<Companies/>:page==='contacto'?<Contact/>:c?<CompanyPage company={c}/>:<Home/>}</main><Footer/></>}
createRoot(document.getElementById('root')!).render(<App/>);
