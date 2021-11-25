import { Button, Card, Input, Form, notification } from "antd";
import { useState, useEffect } from "react";
import contractInfo from "contracts/SquaredNFT_abi.json";
import Address from "components/Address/Address";
import { useMoralis } from "react-moralis";

export default function Contract() {
  const { Moralis } = useMoralis();
  const { abi } = contractInfo;
  const contractAddress = "0xbdda1Fe95B0E43Ca80Fae4EF03268373e0e3779A";
  const [userAddress, setUserAddress] = useState("");
  const [txId, setTxId] = useState("");
  const [responses, setResponses] = useState({});
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintError, setMintError] = useState(false);
  const [mintOn, setMintOn] = useState(false);

  const renderedResult = () => {
    if(mintOn){
      return <div className="mintLoading">
        <svg aria-hidden="true" data-icon="spinner" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100"><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"></path></svg>
      </div>
    }
    if(mintSuccess){
      return <div className="successfulMint">
        <svg aria-hidden="true" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>
        <br/>
        <a href={`https://rinkeby.etherscan.io/tx/${txId}`} target="_blank">See Transaction</a>
      </div>
    }
    if(mintError){
      return <div className="mintError">
        <svg aria-hidden="true" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" width="100"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
      </div>
    }
  }

  const openNotification = ({ message, description }) => {
    notification.open({
      placement: "bottomRight",
      message,
      description,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  useEffect(()=>{
    setUserAddress(Moralis.User.current().get('ethAddress'))
  },[])

  return (
    <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25", width: "50vw" }}>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Mint a NFT
            <Address avatar="left" copyable address={contractAddress} size={8} />
          </div>
        }
        size="large"
        style={{
          width: "60%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      >
        <Form.Provider
          onFormFinish={async (name, { forms }) => {
            setMintOn(true);
            const params = forms[name].getFieldsValue();
            params._to = userAddress;

            let isView = false;

            for (let method of abi) {
              if (method.name !== name) continue;
              if (method.stateMutability === "view") isView = true;
            }

            const options = {
              contractAddress,
              functionName: "mint",
              abi,
              params,
              msgValue: Moralis.Units.ETH("0.05") * params._mintAmount
            };

            if (!isView) {
              const tx = await Moralis.executeFunction({ awaitReceipt: false, ...options });
              tx.on("transactionHash", (hash) => {
                setResponses({ ...responses, [name]: { result: null, isLoading: true } });
                openNotification({
                  message: "🔊 New Transaction",
                  description: `${hash}`,
                });
              })
                .on("receipt", (receipt) => {
                  setResponses({ ...responses, [name]: { result: null, isLoading: false } });
                  openNotification({
                    message: "📃 New Receipt",
                    description: `${receipt.transactionHash}`,
                  });
                  setTxId(receipt.transactionHash);
                  setMintOn(false);
                  setMintSuccess(true);
                })
                .on("error", (error) => {
                  console.log(error);
                  setMintOn(false);
                  setMintSuccess(false);
                  setMintError(true);
                });
            }
          }}
        >
          <Card
            size="small"
            style={{ marginBottom: "20px" }}
          >
            <Form layout="vertical" name="mint">
              <h2>Your Address</h2>
              <h3>{userAddress}</h3>
              <Form.Item
                label="How many NFTs do you want? (max. 10)"
                name="_mintAmount"
                required
                style={{ marginTop: "25px", marginBottom: "15px" }}
              >
                <Input type="number" min="1" max="10" placeholder="Amount of NFTs to mint..." />
              </Form.Item>
              <Form.Item style={{ marginBottom: "5px" }}>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={responses["mint"]?.isLoading}
                >
                  {mintOn ? "Wait a moment..." : "MINT"}
                </Button>
              </Form.Item>
            </Form>
          </Card>

        </Form.Provider>
      </Card>
      <Card
        title={"Transaction Status"}
        size="large"
        style={{
          width: "40%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      >
        { renderedResult() }
        
      </Card>
    </div>
  );
}
