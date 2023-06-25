# Todo List Mobile Application

## Summary
This mobile application allows users to create, edit, and delete todo items. Users can mark items as completed, and the application leverages an API to manage these todo items. The API used for this project is the [dummyjson.com](https://dummyjson.com/) API. Please note that the data submitted to the API is not persisted, and updates to the data will not be reflected upon reloading or refreshing the application.

## Technology Specifications
- Ionic: 7.1.1
- Angular: 16.1.1
- Node.js: 18.16.1
- Capacitor: 5.0.5
- API: [dummyjson.com](https://dummyjson.com/) API Endpoint

## Discussion Document
Given more time, there are several possible improvements that can be implemented in the application:

1. **Using NgRx for State Management**: Currently, the application uses services for managing state. By implementing NgRx, which is a state management library, I can centralize and manage the application's state more efficiently using a predictable and structured pattern.
I
2. **Apply Material Design**: Implementing Material Design principles can enhance the cross-platform compatibility and provide a consistent user experience. Material Design offers a set of guidelines for visual design, motion, and interaction across different platforms. Applying Material Design can make the app more visually appealing and intuitive for users.

3. **SQLite/Web Storage**: Instead of relying solely on the API for data management, we can incorporate SQLite or web storage (such as LocalStorage) within the app. This would allow users to store their todo items locally, ensuring data availability even when the user is offline or the API is not accessible. This local storage mechanism would provide a seamless user experience.

Please note that these are just a few possible improvements that can be implemented with more time. The actual improvements can vary depending on the specific needs and goals of the application.

