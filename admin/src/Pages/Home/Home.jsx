import Header from "../../component/Header/Header";
import "./home.scss";

const Home = () => {
  return (
    <div id="home">
      <Header/>
      <div className="img-wra">
        <img src="/images/landing-1.jpeg" alt="" />
      </div>
    </div>
  );
};

export default Home;