# Decision log

## 1. Share the layout, configure the brands

The six businesses use the same page structure. Company names, colours, icons and app availability live in configuration, and CSS variables apply the selected theme. This keeps fixes consistent across the group and makes another subsidiary an extension of the configuration rather than another copy of the page.

The trade-off is less freedom for each brand. The logo keeps the shared Finchglow name while its mark, business label and colours follow the selected company configuration. The current marks are prototype icons; approved logo assets or different navigation could be added through configuration. A separate page for every business would offer more freedom but create duplication for a small home-page prototype.

## 2. Use the extra feature to show different staff needs

The extra is a role-based launcher, demonstrated through four mock staff profiles. It makes a practical difference immediately: a facilities technician sees facilities requests, learning and HR, while a contact-centre agent also sees booking tools, CRM and suppliers.

This was prioritised over dark mode or offline caching because it demonstrates how one portal can serve different jobs without adding another product area. The account menu is only a demo control, not authentication or security. Offline delivery remains a valuable next step for the weak-Wi-Fi scenario; this version shows failures and offers retry but cannot provide cached alerts offline.

## 3. Keep the backend simulated and spend the scope on the home experience

Local data and asynchronous mock functions make the prototype easy to run without accounts or services. Simulated latency and configurable failures exercise loading, empty, error and retry states. Shared filtering functions keep the same visibility rules in the feeds and search. A small custom loading hook handles the current request lifecycle; a data-fetching library would add little for these few mock requests.

The trade-off is that data ships with the client, acknowledgements reset on refresh, and access filtering is not enforced by a server. App links remain placeholders because building the destination systems is outside the brief. With real services, authentication, permissions and filtering would move behind an API, and caching and request deduplication would deserve another look.

## 4. Remember small, useful actions for each person

Only the last opened app gets a Recently used label and moves to the first position. The other apps keep their usual order. This gives staff a quick way back to their last tool without filling the launcher with history badges. The same priority applies to matching search results, and it never makes an app visible to a role or business that cannot access it.

News has an explicit Read/Unread control because the prototype displays short stories directly in the feed rather than opening separate article pages. Scrolling past a story does not mark it read. The status stays consistent between the feed and search, and staff can undo it.

These choices are saved in localStorage separately for each demo persona. They survive refresh and business changes, but only in that browser. If storage is blocked, the controls still work for the current visit. A real account would need server-side storage to carry this activity between devices.

## 5. Keep long lists inside their panels

Search results scroll inside a panel sized to the available viewport. The search field, result heading and filters stay visible so staff can refine a search without scrolling back to the top. Changing the query, filter, business or persona resets the results' scroll position. The scrolling region is labelled and keyboard-focusable.

On desktop, the news panel matches the Alerts panel's height, with its heading and filters outside the scrolling list. On mobile, news uses normal page scrolling. Search keeps its internal scrolling on both layouts, with space reserved for the bottom navigation.

Internal scrolling adds another scrollable area to the interface. Keeping it to these lists, with visible scrollbars when needed and keyboard access, is the trade-off for keeping the controls in view. The home page itself still scrolls normally.
