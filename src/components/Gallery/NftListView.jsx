const NftListView = (props) => {

    const renderedNftList = props.list[0]?.map(nft=>{
        return (
                <div key={nft} className="nft">
                    <a href={`https://ipfs.io/ipfs/QmTBUGkx1auRxc7j1bEL6We3of3Y8hN1sZCm8WwHRSSWxS/${nft}.png`} target="_blank" rel="noreferrer">
                        <img width={props.nftSize} src={`https://ipfs.io/ipfs/QmTBUGkx1auRxc7j1bEL6We3of3Y8hN1sZCm8WwHRSSWxS/${nft}.png`} alt={nft.name}/>
                    </a>
                </div>
        )
    })
    
    return <>
        <div className="nft-list">
            {renderedNftList}
        </div>
        </>
}

export default NftListView;