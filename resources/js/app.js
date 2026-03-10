import './bootstrap';
import { createApp } from 'vue';
import BookCard from './components/BookCard.vue';
import BookListApp from './components/BookListApp.vue';
import CartApp from './components/CartApp.vue';
import BookDetailsApp from './components/BookDetailsApp.vue';
import ProfileApp from './components/ProfileApp.vue';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
import HomeApp from './components/HomeApp.vue';
import LoginApp from './components/LoginApp.vue';
import RegisterApp from './components/RegisterApp.vue';

import CheckoutApp from './components/CheckoutApp.vue';
import SearchBox from './components/SearchBox.vue';
import AppToast from './components/AppToast.vue';
import GlobalVariables from './components/GlobalVariables.vue';

const app = createApp({});

// Components registration
app.component('global-variables', GlobalVariables);
app.component('book-card', BookCard);
app.component('book-list-app', BookListApp);
app.component('cart-app', CartApp);
app.component('book-details-app', BookDetailsApp);
app.component('profile-app', ProfileApp);
app.component('site-header', SiteHeader);
app.component('site-footer', SiteFooter);
app.component('home-app', HomeApp);
app.component('login-app', LoginApp);
app.component('register-app', RegisterApp);
app.component('checkout-app', CheckoutApp);
app.component('search-box', SearchBox);
app.component('app-toast', AppToast);

app.mount('#app');
