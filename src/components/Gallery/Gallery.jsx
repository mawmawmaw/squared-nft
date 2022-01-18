import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Card } from "antd";
import { useEffect, useState } from "react";
import abi from "contracts/SquaredNFT_abi.json";
import { useMoralis } from "react-moralis";
import NftListView from './NftListView';

export default function Gallery(props) {
    
  const { Moralis } = useMoralis();
  const { isAuthenticated, contractAddress } = props;
    const { walletAddress } = useMoralisDapp();
    const [nftList, setNftList] = useState([]);

    useEffect(()=>{
        if(isAuthenticated){
            const options = {
                contractAddress,
                functionName: 'walletOfOwner',
                abi,
                params: {
                    "_owner": walletAddress
                }
              };
              Moralis.executeFunction(options).then((response) =>{
                setNftList([...nftList, response])
              });
        }
    // eslint-disable-next-line
    },[walletAddress])

    return (
            <Card 
            style={{ marginTop: "25", width: "50vw", borderRadius: "8px" }}
            title={`Gallery (${ nftList[0]?.length ? nftList[0]?.length : "0"})`}
            size="large"
            >
                <NftListView list={nftList} nftSize={200}/>
            </Card>
    )
}
