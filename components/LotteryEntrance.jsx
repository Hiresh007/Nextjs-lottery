import React, { useEffect, useState } from 'react'
import { useWeb3Contract } from 'react-moralis'
import { abi , contractAddresses } from '@constants'
import { useMoralis } from 'react-moralis'
import {ethers} from "ethers"
import { Button } from 'antd'
import { useNotification } from 'web3uikit'
const LotteryEntrance = () => {
  const [entranceFee , setEntranceFee] = useState("0")
  const [numPlayers , setPlayers] = useState("0")
  const [winner , setWinner] = useState("0")
  const {chainId:chainIdhex , isWeb3Enabled} = useMoralis()
  const chainId= parseInt(chainIdhex)
  const dispatch = useNotification()
  const raffleAddress = chainId in contractAddresses?contractAddresses[chainId][0]:null
    const {runContractFunction: enterRaffle , isFetching, isLoading} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName:"enterRaffle",
        params:{},
        msgValue:entranceFee
    })
  
    const {runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName:"getEntranceFee",
        params:{},
    })
    const {runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName:"getNumberOfPlayers",
        params:{},
    })
    const {runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName:"getRecentWinner",
        params:{},
    })

    async function updateUI(){
     const entranceFeefromCall = (await getEntranceFee()).toString()
     const numPlayersfromCall = (await getNumberOfPlayers()).toString()
     const recentWinnerfromCall = await getRecentWinner()
     setEntranceFee(entranceFeefromCall)
     setPlayers(numPlayersfromCall)
     setWinner(recentWinnerfromCall)
 }
    useEffect(() => {
           if(isWeb3Enabled){
          updateUI()
        }
      },[isWeb3Enabled])
      
      const handleSuccess = async (tx) =>{
        updateUI()
        await tx.wait(1)
        handleNotification(tx)
      }   
    const  handleNotification = () => {
      dispatch({
        type:"info",
        message:"Transaction Complete",
        title:"Transaction Notification",
        position:"topR",
        icon:"bell",
      })
    }
  return (
    <div>
      {raffleAddress?(
        <div className='flex flex-col gap-2'>
              <Button 
              className="text-slate-100 bg-sky-500 w-[20%] h-[40px]"
              onClick={async () => await enterRaffle({
                onError: (error) => console.log(error),
                onSuccess:handleSuccess,
              })} disabled ={isFetching || isLoading} >{isFetching || isLoading ?(<div className='animate-spin spinner-border h-8 border-b-2 rounded-full bg-sky-400'></div>): <div>Enter Raffle</div> }</Button>
              <div>
             <strong> Entrance Fee : </strong>{ethers.utils.formatUnits(entranceFee, "ether")}ETH
              </div>
              <div>
                <strong>
                Number of Players : </strong>
                   {numPlayers}
              </div>
              <div>
                <strong> Recent Winner : </strong>
              {winner}

              </div>
        </div>
      ):<div> No raffle address detected</div> }
  
      
      </div>
  )
}

export default LotteryEntrance