# Event Tracker

A simple web application to track important events and anniversaries with elapsed time calculations. All data is stored locally in your browser.

![Event Tracker Screenshot](https://github.com/user-attachments/assets/deb29fb7-bc39-497b-844a-aa9341d20741)

## Features

- Add, edit, and delete events
- Automatic calculation of elapsed time (years, months, days)
- Local storage persistence (no server required)
- Clean, responsive interface
- Bootstrap icons integration

## Technologies Used

- HTML5
- CSS (Tailwind CSS)
- JavaScript (ES6)
- LocalStorage API

## Installation

No installation required! Simply open the `index.html` file in any modern web browser.

For development purposes:

1. Clone this repository
2. Open `index.html` in your browser

## Usage

1. **Add an Event**:

   - Enter an event name
   - Select a date
   - Click "Add Event"

2. **Edit an Event**:

   - Click the pencil icon on any event
   - Modify the name or date
   - Click "Update Event"

3. **Delete an Event**:
   - Click the trash icon on any event
   - Confirm deletion

## Data Storage

All events are stored in your browser's localStorage, meaning:

- Data persists between sessions
- Data is specific to your browser/device
- No data is sent to any server

## Customization

You can easily customize the appearance by modifying:

- The Tailwind CSS classes in `index.html`
- The color scheme in the button classes
- The font family in the `<style>` section

## Browser Support

The application should work in all modern browsers including:

- Chrome
- Firefox
- Safari
- Edge

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please open an issue or pull request for any improvements.

## Future Enhancements

Potential future features:

- Event categories/tags
- Notifications/reminders
- Export/import functionality
- Dark mode support
