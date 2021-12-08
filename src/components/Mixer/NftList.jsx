const NftList = (props) => {

    const addNFTtoList = (nft) => {
        if(props.selectedNFTs.length < 4)
            props.setSelectedNFTs([...props.selectedNFTs, nft]);
    }

    const renderedNftList = props.list[0]?.map(nft=>{
        return (
                <div key={nft} className="nft" onClick={()=>{addNFTtoList(nft)}}>
                    <img width={props.nftSize} src={`https://ipfs.io/ipfs/QmTBUGkx1auRxc7j1bEL6We3of3Y8hN1sZCm8WwHRSSWxS/${nft}.png`} alt={nft.name}/>
                </div>
        )
    })
    
    return <div className="nft-list">
                {renderedNftList}
            </div>
}

export default NftList;