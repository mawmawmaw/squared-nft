import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import {
  HashRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import { Button, Card, Row, Col } from "antd";
import headerLogo from './assets/logo.png';
import metamask from './assets/metamask.png';
import avalanche from './assets/avalanche.png';
import authenticate from './assets/authenticate.png';
import Account from "components/Account";
import Address from "components/Address/Address";
import { Menu, Layout } from "antd";
import "antd/dist/antd.css";
import "./style.css";
import Contract from "components/Contract/Contract";
import Gallery from "components/Gallery/Gallery";
import Mixer from "components/Mixer/Mixer";
import Whitelist from "components/Whitelist/Whitelist";
const { Header } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = () => {
  // const contractAddress = "0xbdda1Fe95B0E43Ca80Fae4EF03268373e0e3779A"; //RInkeby
  const contractAddress = "0xb097718DdE248b35485114661d437f0B0bDE40fD"; //Fuji
  const { Meta } = Card;
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto", backgroundColor: "#ffffff66" }}>
      <Router>
        <Header style={styles.header}>
          <Logo />
          <Menu
            theme="light"
            mode="horizontal"
            style={{
              display: "flex",
              fontSize: "17px",
              fontWeight: "500",
              width: "100%",
              marginLeft: "100px",
            }}
            defaultSelectedKeys={["home"]}
          >

            <Menu.Item key="home">
              <NavLink to="/">Home</NavLink>
            </Menu.Item>
            <Menu.Item key="mint" disabled={isAuthenticated ? false : true}>
              <NavLink to="/mint">Mint</NavLink>
            </Menu.Item>
            <Menu.Item key="gallery" disabled={isAuthenticated ? false : true}>
              <NavLink to="/gallery">My Squares</NavLink>
            </Menu.Item>
            <Menu.Item key="how">
              <NavLink to="/how-to">FAQ</NavLink>
            </Menu.Item>

          </Menu>
          <div style={styles.headerRight}>
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Switch>
            <Route path="/" exact>
              <div className="home">
                <h1>Squared NFT</h1>
                <Button
                  type="primary"
                  size="large"
                  disabled={isAuthenticated ? false : true}
                >
                  <NavLink to="/whitelist">Whitelist</NavLink>
                </Button>
                <Button
                  type="primary"
                  size="large"
                  disabled={isAuthenticated ? false : true}
                >
                  <NavLink to="/mint">Mint a NFT</NavLink>
                </Button>
                <Button
                  type="secondary"
                  size="large"
                >
                  <NavLink to="/how-to">How to Mint</NavLink>
                </Button>
              </div>
            </Route>
            <Route path="/whitelist">
              <>
              {isAuthenticated || <Redirect to="/" /> }
              <Whitelist isAuthenticated={isAuthenticated} contractAddress={contractAddress}/>
              </>
            </Route>
            <Route path="/mint">
              <>
              {isAuthenticated || <Redirect to="/" /> }
              <Contract isAuthenticated={isAuthenticated} contractAddress={contractAddress}/>
              </>
            </Route>
            <Route path="/how-to">
              <div className="how-to-container" style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25", width: "50vw" }}>
                <Card
                  title="FAQ"
                  size="large"
                  style={{
                    width: "100%",
                    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
                    border: "1px solid #e7eaf3",
                    borderRadius: "0.5rem",
                  }}
                >
                  
                  <h2>What is the Contract Address?</h2>
                  <Address avatar="left" copyable address={contractAddress} size={8} />
                  <br/>
                  <h2>How to Mint a NFT</h2>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={8}>
                      <Card bordered={false} cover={<img alt="metamask" src={metamask} />}>
                        <Meta title="1. Install Metamask" />
                        <p>If you don't have <a href="https://metamask.io/" target="_blank" rel="noreferrer">Metamask</a> installed, first <a href="https://metamask.io/" target="_blank" rel="noreferrer">download it</a> and create an account. Be sure to keep your keys safe!</p>
                      </Card>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <Card bordered={false} cover={<img alt="avalanche" src={avalanche} />}>
                        <Meta title="2. Switch to Fuji Testnet" />
                        <p>Switch to Fuji (Avalanche Testnet) and be sure to have some Test AVAX. If you need some, please visit an AVAX Faucet like: <a href="https://faucet.avax-test.network/" target="_blank" rel="noreferrer">Fuji Avalanche Testnet Faucet</a></p>
                      </Card>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <Card bordered={false} cover={<img alt="authenticate" src={authenticate} />}>
                        <Meta title="3. Authenticate" />
                        <p>Authenticate with Metamask using the button in the top right of the site. Once you've done so, go to the <NavLink to="/mint">Minting Page</NavLink>.</p>
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </div>
            </Route>
            
            <Route path="/gallery">
              <>
              {isAuthenticated || <Redirect to="/" /> }
              <Gallery isAuthenticated={isAuthenticated} contractAddress={contractAddress}/>
              </>
            </Route>
            <Route path="/mixer">
              <>
              {isAuthenticated || <Redirect to="/" /> }
              <Mixer isAuthenticated={isAuthenticated} contractAddress={contractAddress}/>
              </>
            </Route>
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
        </div>
      </Router>
    </Layout>
  );
};

export const Logo = () => (
  <div className="logo-container" style={{ display: "flex" }}>
    <img src={headerLogo} alt="Logo" />
  </div>
);

export default App;
