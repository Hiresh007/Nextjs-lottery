import React, { useEffect } from 'react'
import { Button } from 'antd'
import {useMoralis} from 'react-moralis'
const Header = () => {
    const {enableWeb3, isWeb3Enabled, account , Moralis, deactivateWeb3 ,isWeb3EnableLoading} = useMoralis()
    useEffect(() => {
        if(isWeb3Enabled) return 
        if(typeof window !== "undefined"){
            if(window.localStorage.getItem("connected")){
                enableWeb3()
            }
        }
    },[isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(account)
            if(account == null){
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null Account found")
            }
        })
    },[])
  return (
    <div>
       {account?(<div>Connected to {account}</div>):(<Button onClick={async () => {await enableWeb3()
       if(typeof window !== "undefined"){
        window.localStorage.setItem("connected" , "injected")
       }
    }} disabled ={isWeb3EnableLoading}>Connect</Button>)}
   </div>
  )
}

export default Header