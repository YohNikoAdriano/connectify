// Header in navigation
export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Explore Event",
    route: "/#events",
  },
  {
      label: "Create Event",
      route: "/events/create",
    },
  {
    label: "My Profile",
    route: "/profile",
  },
];
  
// Default Values when User Create or Update Event on Form
export const eventDefaultValues = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: "",
  price: "",
  isFree: false,
  url: "",
};