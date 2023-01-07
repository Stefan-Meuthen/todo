import "./MainSection.css";
import Cat from './Cat.js';
import { useState , useEffect } from "react";
import { ethers } from "ethers";
import ABI from "./ABI.json";
import Card from './Card.js';

function MainSection() {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [chainName, setChainName] = useState(null);
    const [balance, setBalance] = useState(null);
    const [blockNumber, setBlockNumber] = useState(null);

    const [input, setInput] = useState(null);
    const [task, setTask] = useState([]);

    const getData = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract('0x1D0325De9A6C66c0b8B631EC7e47D3627EdbE5EB', ABI, signer);

        const total = await contract.totalTasks();

        setTask([]);
        for (var i = 0; i < total; i++) {
            const currentTask = await contract.taskList(i);
            setTask(prevTask => [...prevTask, currentTask]);
        }
    }

    const change = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract('0x1D0325De9A6C66c0b8B631EC7e47D3627EdbE5EB', ABI, signer);

        const createTask = await contract.createTask(input);

    }
    
    const getWalletAddress = async () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts");
            const currentAddress = await provider.getSigner().getAddress();

            setCurrentAccount(currentAddress)

            const chain = await provider.getNetwork();
            setChainId(chain.chainId);
            setChainName(chain.name);

            const amount = await provider.getBalance(currentAddress);
            const amountInEth = ethers.utils.formatEther(amount);
            setBalance(amountInEth);

            const blockNumber = await provider.getBlockNumber();
            setBlockNumber(blockNumber);


        }
    }

    const chainChanged = () => {
        window.location.reload();
    }
    window.ethereum.on('chainChanged', chainChanged);
    window.ethereum.on('accountsChanged', getWalletAddress)

    useEffect(() => {
        getWalletAddress();
        getData();
    }, []);

    return (
        <div class="mainsection">
            <div class="content">
                <button onClick={getWalletAddress}> connect wallet </button>
                <p>{currentAccount}</p>
                <p> Chain Id: {chainId} </p>
                <p> Chain name: {chainName} </p>
                <p> Eth: {balance} </p>
                <p> Block#: {blockNumber}</p>

                <input value={input} onInput={newLetter => setInput(newLetter.target.value)} />
                <button onClick={change} > ADD </button>
                <button onClick={getData} > UPDATE </button>

                {task.map((item) => (
                    <Card Name={item.taskName} id={item.id} done={item.completedCheck} />
                ))}

            </div>

            <div class="sidebar">
                <Cat id="304" name="Esteban"/>
                <Cat id="301" name="Adolfus" />
                <Cat id="303" name="Benito" />
                <Cat id="299" name="Winston"/>
            </div>
        </div>
    );
}

export default MainSection;