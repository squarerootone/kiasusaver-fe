import { createQwikCity } from '@builder.io/qwik-city/middleware/cloudflare-pages';
import render from './entry.ssr';
import qwikCityPlan from '@qwik-city-plan';

export default createQwikCity({ render, qwikCityPlan });
