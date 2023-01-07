import "./Card.css";
import { useState } from "react";
import ABI from "./ABI.json";
import { ethers } from "ethers";

function Card(props) {

    const [checked, setChecked] = useState(props.done)

    const toggle = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x1D0325De9A6C66c0b8B631EC7e47D3627EdbE5EB", ABI, signer);

        const toggleContract = await contract.toggleTask(props.id);

        const receipt = await toggleContract.wait();
        if (receipt.confirmations > 0) {
            setChecked(!checked);
        }
    }

    return (
        <div className="ToDoItem">
            <p>{props.Name} </p>
            <input onClick={toggle} type="checkbox" checked={checked} />
        </div>
    );
}

export default Card;