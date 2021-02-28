'use strict';

// ============================================================================
// Translation UI
// ============================================================================

import Module from 'utilities/module';
import Dialog from 'utilities/dialog';

import {createElement} from 'utilities/dom';

export default class TranslationUI extends Module {
	constructor(...args) {
		super(...args);

		this.inject('site');

		this.inject('vue', true);

		this.dialog = new Dialog(() => this.buildDialog());
	}

	openPopout() {
		const win = window.open(
			'https://twitch.tv/popout/frankerfacez/chat?ffz-translate',
			'_blank',
			'resizable=yes,scrollbars=yes,width=850,height=600'
		);

		if ( win ) {
			win.focus();
			return true;
		} else {
			this.log.warn('Unable to open popout translation window.');
			return false;
		}
	}

	async onLoad() {
		this.vue.component(
			(await import(/* webpackChunkName: "translation-ui" */ './components.js')).default
		);
	}

	async onEnable() {
		await this.site.awaitElement(Dialog.EXCLUSIVE);

		this.on('i18n:seen', key => {
			if ( ! this._vue )
				return;

			const comp = this._vue.$children[0];
			comp.phrases.push(key);
		})

		this.dialog.on('hide', this.destroyDialog, this);
		this.dialog.on('resize', () => {
			if ( this._vue )
				this._vue.$children[0].maximized = this.dialog.maximized
		});

		this.dialog.show();
	}

	onDisable() {
		this.dialog.hide();
	}


	buildDialog() {
		if ( this._dialog )
			return this._dialog;

		this._vue = new this.vue.Vue({
			el: createElement('div'),
			render: h => h('translation-ui', this.getData())
		});

		return this._dialog = this._vue.$el;
	}

	destroyDialog() {
		if ( this._vue )
			this._vue.$destroy();

		this._dialog = this._vue = null;
	}


	getData() {
		this.i18n.loadStrings();

		return {
			phrases: [],
			query: '',

			faded: false,
			maximized: this.dialog.maximized,
			exclusive: this.dialog.exclusive,

			getI18n: () => this.i18n,
			getKeys: () => this.i18n.getKeys(),
			requestKeys: () => this.i18n.requestKeys(),
			updatePhrase: (key, phrase) => this.i18n.updatePhrase(key, phrase),

			listen: (event, fn, ctx) => this.on(event, fn, ctx),
			unlisten: (event, fn, ctx) => this.off(event, fn, ctx),

			resize: e => ! this.dialog.exclusive && this.dialog.toggleSize(e),
			close: e => ! this.dialog.exclusive && this.dialog.toggleVisible(e),

			popout: e => {
				if ( this.dialog.exclusive )
					return;

				this.dialog.toggleVisible(e);
				if ( ! this.openPopout() )
					alert(this.i18n.t('popup.error', 'We tried opening a pop-up window and could not. Make sure to allow pop-ups from Twitch.')); // eslint-disable-line no-alert
			}
		}
	}
}