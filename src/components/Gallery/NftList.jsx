import { useState } from "react";

const NftList = (props) => {
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(10);

    console.log(props.list[0])


    const renderedNftList = props.list[0]?.length > 10 
    ? props.list[0].slice(min, max).map(nft=>{
        return (
                <div className="nft" key={nft.name}>
                    <a href={`https://gateway.pinata.cloud/ipfs/QmTBUGkx1auRxc7j1bEL6We3of3Y8hN1sZCm8WwHRSSWxS/${nft}.png`} target="_blank" rel="noreferrer">
                        <img width="200" src={`https://gateway.pinata.cloud/ipfs/QmTBUGkx1auRxc7j1bEL6We3of3Y8hN1sZCm8WwHRSSWxS/${nft}.png`} alt={nft.name}/>
                    </a>
                </div>
        )
    })
    : props.list[0]?.map(nft=>{
        return (
                <div className="nft" key={nft.name}>
                    <a href={`https://gateway.pinata.cloud/ipfs/QmTBUGkx1auRxc7j1bEL6We3of3Y8hN1sZCm8WwHRSSWxS/${nft}.png`} target="_blank" rel="noreferrer">
                        <img width="200" src={`https://gateway.pinata.cloud/ipfs/QmTBUGkx1auRxc7j1bEL6We3of3Y8hN1sZCm8WwHRSSWxS/${nft}.png`} alt={nft.name}/>
                    </a>
                </div>
        )
    })
    const loadMore = () => {
        if(min >= 10 && min < max) setMin(min+10);
        if(max <= props.list[0].length) setMax(max+10);
    }
    
    return <div className="nft-list">
        {renderedNftList}
        <button onClick={loadMore}>Load more...</button>
        </div>
}

export default NftList;