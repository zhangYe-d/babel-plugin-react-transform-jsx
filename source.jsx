const string = "hello";
const Foo = () => {
  return 1;
};

const App = () => {
  return <h1 className="app">world{<Foo />}</h1>;
};

<App />;
