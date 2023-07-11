(async function QueuePanel() {
	if (!Spicetify.React || !Spicetify.Panel || !Spicetify.Platform) {
		setTimeout(QueuePanel, 100);
		return;
	}

	const { useState } = Spicetify.React;
	const require = webpackChunkopen.push([[Symbol()], {}, re => re]);
	const pages = {};

	function loadModule(module) {
		const script = document.createElement("script");
		script.src = `/${module}.js`;
		document.head.appendChild(script);

		const styles = document.createElement("link");
		styles.rel = "stylesheet";
		styles.text = "text/css";
		styles.href = `/${module}.css`;
		document.head.appendChild(styles);

		fetch(`/${module}.js`)
			.then(res => res.text())
			.then(async text => {
				for (let pack of text.match(/(\d+):\(/g).map(str => str.slice(0, -2))) {
					while (!Object.keys(require.m).includes(pack)) {
						await new Promise(r => setTimeout(r, 100));
					}

					pack = require(pack);
					if (pack.default) {
						const namedModule = module
							.slice(12)
							.split("-")
							.map(str => str[0].toUpperCase() + str.slice(1))
							.join("");
						pages[namedModule] = pack.default;
					}
				}
			});
	}

	["xpui-routes-queue-page", "xpui-routes-play-history-page"].forEach(loadModule);

	while (!pages.QueuePage || !pages.PlayHistoryPage) {
		await new Promise(r => setTimeout(r, 100));
	}

	function Queue({ id }) {
		const [isQueuePage, setQueueState] = useState(true);
		const label = isQueuePage
			? Spicetify.Locale.get("playback-control.queue")
			: Spicetify.Locale.get("view.recently-played");

		return Spicetify.React.createElement(
			Spicetify.ReactComponent.PanelSkeleton,
			{
				label,
				className: "Root__right-sidebar",
				style: { minWidth: "380px" },
			},
			Spicetify.React.createElement(
				Spicetify.ReactComponent.PanelContent,
				null,
				Spicetify.React.createElement(Spicetify.ReactComponent.PanelHeader, {
					title: label,
					panel: id,
					link: isQueuePage ? "/queue" : "/history",
					actions: Spicetify.React.createElement(Toggle, {
						state: isQueuePage,
						callback: setQueueState,
					}),
				}),
				Spicetify.React.createElement(isQueuePage ? pages.QueuePage : pages.PlayHistoryPage)
			)
		);
	}

	function Toggle({ state, callback }) {
		return Spicetify.React.createElement(
			Spicetify.ReactComponent.TooltipWrapper,
			{
				label: state
					? Spicetify.Locale.get("view.recently-played")
					: Spicetify.Locale.get("playback-control.queue"),
			},
			Spicetify.React.createElement(
				"button",
				{
					className:
						"main-buddyFeed-closeButton Button-sm-16-buttonTertiary-iconOnly-isUsingKeyboard-useBrowserDefaultFocusStyle Button-sm-16-buttonTertiary-iconOnly-useBrowserDefaultFocusStyle",
					onClick: () => callback(!state),
				},
				Spicetify.React.createElement("svg", {
					width: "16",
					height: "16",
					viewBox: state ? "4 4 16 16" : "0 0 16 16",
					fill: "currentColor",
					dangerouslySetInnerHTML: {
						__html: state
							? `<path d="M18.55,12c0-3.64-2.93-6.55-6.55-6.55-.4,0-.73-.29-.73-.73s.33-.73,.73-.73c4.42,0,8,3.56,8,8s-3.58,8-8,8-8-3.56-8-8c0-.44,.33-.73,.73-.73s.73,.29,.73,.73c0,3.64,2.93,6.55,6.55,6.55s6.55-2.91,6.55-6.55Z"></path><path d="M8.78,6.47c-.43,.29-.99,.14-1.24-.29-.25-.44-.1-1.02,.33-1.24,.43-.29,.99-.15,1.24,.29,.25,.44,.1,1.02-.33,1.24Z"></path><path d="M11.3,7.64c0-.44,.33-.73,.73-.73s.73,.29,.73,.73v3.64h2.16c.4,0,.73,.29,.73,.73s-.33,.73-.73,.73h-3.61V7.64Z"></path><path d="M5.21,9.16c.43,.22,.99,.07,1.24-.36,.25-.44,.1-.94-.33-1.24-.43-.22-.99-.07-1.24,.36s-.1,.94,.33,1.24Z"></path>`
							: Spicetify.SVGIcons.queue,
					},
				})
			)
		);
	}

	const { toggle, onStateChange, isActive } = Spicetify.Panel.registerPanel({
		isCustom: true,
		children: Spicetify.React.createElement(Queue),
	});

	const button = new Spicetify.Playbar.Button(
		Spicetify.Locale.get("playback-control.queue"),
		"queue",
		() => {
			const cacheScrollPos = document.querySelector(".Root__main-view .os-viewport")?.scrollTop;
			toggle().then(() => {
				const viewport = document.querySelector(".Root__main-view .os-viewport");
				if (viewport && cacheScrollPos !== undefined) viewport.scrollTop = cacheScrollPos;
			});
		},
		false,
		isActive
	);

	onStateChange(state => {
		button.active = state;
	});

	button.element.children[0].removeAttribute("stroke");

	const style = document.createElement("style");
	style.id = "queue-panel";
	style.innerHTML = `
.main-buddyFeed-content .contentSpacing {
  padding: 0 !important;
}
.main-buddyFeed-content .contentSpacing .queue-queuePage-queuePage {
  margin-top: 20px !important;
}
.main-buddyFeed-content .contentSpacing h1,
.main-buddyFeed-content .contentSpacing .main-trackList-rowMoreButton,
.main-buddyFeed-content .contentSpacing .main-trackList-trackListHeader {
  display: none !important;
}
.main-buddyFeed-content .contentSpacing .main-trackList-rowSectionEnd :nth-last-child(2) {
  margin-right: 0 !important;
}
.main-buddyFeed-content .contentSpacing .main-trackList-trackList[aria-colcount="2"] .main-trackList-trackListRowGrid {
  grid-template-columns: [first] 4fr [last] minmax(70px, 1fr) !important;
}
.main-buddyFeed-content .contentSpacing .main-trackList-trackList.main-trackList-indexable[aria-colcount="3"] .main-trackList-trackListRowGrid {
  grid-template-columns: [index] 16px [first] 4fr [last] minmax(70px, 1fr) !important;
}
.main-buddyFeed-content .contentSpacing .main-trackList-trackList.main-trackList-indexable[aria-colcount="3"] .main-trackList-trackListRowGrid:has(.main-trackList-rowSectionEnd > div > button:nth-child(2)) {
  grid-template-columns: [index] 16px [first] 4fr [last] minmax(100px, 1fr) !important;
}
#main:not([data-page="/queue"], [data-page="/history"]) .main-topBar-topbarContent .queue-tabBar-nav,
#main:is([data-page="/queue"], [data-page="/history"]) .main-topBar-topbarContent:nth-child(1) .queue-tabBar-nav {
  display: none !important;
}`;
	document.head.appendChild(style);

	(function waitForQueueButton() {
		const extraControls = button.element.parentElement;
		if (!extraControls) {
			setTimeout(waitForQueueButton, 100);
			return;
		}
		Spicetify.Platform.History.listen(({ pathname }) => {
			document.getElementById("main").dataset.page = pathname;
		});

		document.getElementById("main").dataset.page = Spicetify.Platform.History.location.pathname;

		const queueButton = extraControls.querySelector(".GlueDropTarget");
		extraControls.insertBefore(button.element, queueButton);
		queueButton.style.display = "none";
	})();
})();
