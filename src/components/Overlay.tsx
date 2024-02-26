interface propType {
  handleSidebar: () => void;
}
const Overlay: React.FC<propType> = ({ handleSidebar }) => {
  return (
    <div
      className="fixed w-screen h-screen bg-black bg-opacity-50"
      onClick={handleSidebar}
    ></div>
  );
};

export default Overlay;
