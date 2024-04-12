import logo from "/img/logo.png";

const Preloader = () => {
  return (
    <div className="flex items-center justify-center h-screen z-[999]">
      <div className="flex items-center justify-center preloader-img">
        <div className="md:w-[20%] w-[40%]">
          <img src={logo} className="w-full" alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
