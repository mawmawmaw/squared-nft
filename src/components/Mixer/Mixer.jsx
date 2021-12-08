import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Card } from "antd";
import { useEffect, useState } from "react";
import contractInfo from "contracts/SquaredNFT_abi.json";
import { useMoralis } from "react-moralis";
import NftList from './NftList';

export default function Mixer(props) {
    
    const contractAddress = "0xbdda1Fe95B0E43Ca80Fae4EF03268373e0e3779A";
    const { abi } = contractInfo;
    const { Moralis } = useMoralis();
    const { isAuthenticated } = props;
    const { walletAddress } = useMoralisDapp();
    const [nftList, setNftList] = useState([]);
    const [selectedNFTs, setSelectedNFTs] = useState([]);
    const [newNFT, setNewNFT] = useState([]);
    const [created, setCreated] = useState(false);

    const renderedSelectedList = selectedNFTs.map((nft)=>{
        return <div key={nft} className="selected-grid">
                    <img width={props.nftSize} src={`https://ipfs.io/ipfs/QmTBUGkx1auRxc7j1bEL6We3of3Y8hN1sZCm8WwHRSSWxS/${nft}.png`} alt={nft.name}/>
                </div>
    })

    const renderMixerView = () => {
        if(created === true){
            return <div id="mixer-result">
                        {newNFT.toString()}
                    </div>
        }else{
            return  <>
                        <div className="mixer-options">
                            {selectedNFTs.length !== 4 || <div id="get-selection" onClick={getSelection}>Generate New Square</div>}
                            {selectedNFTs.length === 0 || <div id="clear-selection" onClick={()=>{setSelectedNFTs([])}}>Clear selection</div>}
                        </div>
                        <div id="mixer-grid">
                            {renderedSelectedList}
                        </div>
                    </>
        }
    }

    const getSelection = () => {
        let newnft = [];
        selectedNFTs.forEach((nft, i)=>{
            fetch(`https://ipfs.io/ipfs/QmY5VfUjuzWzsw1UMRyRrn79gjMg7fTE3beA1GnJFuooVS/${nft}.json`)
            .then(res=>res.json())
            .catch(error=>console.error(error))
            .then(res=>{
                switch(i){
                    case 0: newnft[i] = res.attributes[3].value; break;
                    case 1: newnft[i] = res.attributes[2].value; break;
                    case 2: newnft[i] = res.attributes[1].value; break;
                    case 3: newnft[i] = res.attributes[0].value; break;
                    default: break;
                }
                
            });
        })
        setNewNFT(newnft);
        setCreated(true);
    }

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

    return (<>
                <Card 
                style={{ marginTop: "25", width: "18vw", borderRadius: "8px", height: "80vh", overflowY: "scroll" }}
                title={`Squares (${nftList[0]?.length})`}
                size="large"
                >
                    <h4>Choose 4 Squared NFTs to mix</h4><br/>
                    <NftList list={nftList} nftSize={120} setSelectedNFTs={setSelectedNFTs} selectedNFTs={selectedNFTs}/>
                </Card>
                <Card 
                style={{ marginTop: "25", width: "32vw", borderRadius: "8px" }}
                title={"Mixer"}
                size="large"
                >
                    {
                        renderMixerView()
                    }
                </Card>
            </>
    )
}
