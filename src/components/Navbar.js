'use strict';

import '../styles/Navbar.css';
import h from 'snabbdom/h';

function view(model, handler) {
	return h('header', [
		h('a', { attrs: { href: 'http://www.cartong.org/', target: '_blank' } }, [
			h('img#cartong-logo', { attrs: { src: './images/CartONG_logo.png', alt: 'CartONG logo' } })	
		]),
		h('h1', 'Mapathon Dashboard'),
		h('a', { attrs: { href: 'http://www.missingmaps.org', target: '_blank' } }, [
			h('img#mm-logo', { attrs: { src: './images/mm_logo.png', alt: 'Missing Maps logo' } })	
		]),
		h('a', { attrs: { href: 'https://www.hotosm.org/', target: '_blank' } }, [
			h('img#hot-logo', { attrs: { src: './images/hot_logo.png', alt: 'HOT logo' } })	
		])
	]);
}

export default { view }