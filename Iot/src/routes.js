import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
// import Maps from "views/examples/Maps.js";
// import Register from "views/examples/Register.js";
// import Login from "views/examples/Login.js";
import HistoryTable from "views/examples/History";
import TableWithHistory from "views/examples/TableWithHistory";
import SearchComponent from "views/examples/Search";

// import Tables from "views/examples/Tables.js";
// import Icons from "views/examples/Icons.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-planet text-blue",
  //   component: <Icons />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: <Maps />,
  //   layout: "/admin",
  // },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: <Tables />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/login",
  //   name: "Login",
  //   icon: "ni ni-key-25 text-info",
  //   component: <Login />,
  //   layout: "/auth",
  // },
  // {
  //   path: "/register",
  //   name: "Register",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: <Register />,
  //   layout: "/auth",
  // },
  {
    path: "/history",
    name: "History",
    icon: "ni ni-collection text-red",
    component: <HistoryTable/>,
    layout: "/admin",
  },
  // {
  //   path: "/table",
  //   name: "Table",
  //   icon: "ni ni-collection text-red",
  //   component: <Table/>,
  //   layout: "/admin",
  // },
  {
    path: "/search",
    name: "Search",
    icon: "ni ni-collection text-red",
    component: <SearchComponent/>,
    layout: "/admin",
  },
  {
    path: "/tablehistory",
    name: "TableWithHistory",
    icon: "ni ni-collection text-red",
    component: <TableWithHistory/>,
    layout: "/admin",
  }
];
export default routes;
