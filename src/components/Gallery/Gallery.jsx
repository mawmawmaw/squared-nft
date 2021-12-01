import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Card } from "antd";
import { useEffect, useState } from "react";
import contractInfo from "contracts/SquaredNFT_abi.json";
import { useMoralis } from "react-moralis";
import NftList from './NftList';

export default function Gallery(props) {
    
  const contractAddress = "0xbdda1Fe95B0E43Ca80Fae4EF03268373e0e3779A";
  const { abi } = contractInfo;
  const { Moralis } = useMoralis();
    const { isAuthenticated } = props;
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
            title={"Gallery"}
            size="large"
            >
                <NftList list={nftList}/>
            </Card>
    )
}
