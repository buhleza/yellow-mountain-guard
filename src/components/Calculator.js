import { useState } from "react";



function Calculator() {

const [tonnesInput, setTonnesInput] = useState("5000");

const [tonnes, setTonnes] = useState(5000);



const [requestStatus, setRequestStatus] = useState({});



// Fixed industry assumptions

const GOLD_PER_TONNE = 0.1;

const GOLD_PRICE = 1400;

const BRICKS_PER_TONNE = 30;

const BRICK_PRICE = 2.5;

const TONNES_PER_JOB = 180;



const goldGrams = tonnes * GOLD_PER_TONNE;

const goldValue = goldGrams * GOLD_PRICE;

const bricks = tonnes * BRICKS_PER_TONNE;

const brickValue = bricks * BRICK_PRICE;

The number of jobs is obtained by dividing the tonnes by TONNES_PER_JOB and then rounding the result.

const totalValue = goldValue + brickValue;



const formatR = (num) => "R" + num.toLocaleString("en-ZA");



const handleRun = () => {

const value = Number(tonnesInput) || 0;

setTonnes(value);

setRequestStatus({});

};



const allCompanies = [

{ id: 1, name: "Bafenyi African Group", request: "silica tailings (bricks)", minTonnes: 1000, maxTonnes: 8000, ratePerTonne: 8 },

{ id: 2, name: "Pan African Resources", request: "gold-bearing tailings", minTonnes: 3000, maxTonnes: 15000, ratePerTonne: 15 },

{ id: 3, name: "Crush It Green", request: "any tailings", minTonnes: 4000, maxTonnes: 20000, ratePerTonne: 5 },

{ id: 4, name: "Rainbow Rare Earths", request: "rare earth tailings", minTonnes: 500, maxTonnes: 3000, ratePerTonne: 25 },

{ id: 5, name: "Goldplat Recovery", request: "gold tailings", minTonnes: 2000, maxTonnes: 10000, ratePerTonne: 12 },

{ id: 6, name: "Harmony Mine Waste Solutions", request: "low-grade gold tailings", minTonnes: 5000, maxTonnes: 25000, ratePerTonne: 10 },

{ id: 7, name: "Maupa Engineering", request: "chrome-rich tailings for bricks", minTonnes: 800, maxTonnes: 6000, ratePerTonne: 7 },

{ id: 8, name: "Neo Performance Materials", request: "rare earth tailings", minTonnes: 1000, maxTonnes: 5000, ratePerTonne: 22 },

{ id: 9, name: "Marikana Aggregates", request: "silica tailings for road base", minTonnes: 3000, maxTonnes: 12000, ratePerTonne: 6 },

];



const matchedCompanies = allCompanies.filter(

(c) => tonnes >= c.minTonnes && tonnes <= c.maxTonnes

);



const handleAccept = (company) => {

setRequestStatus({

...requestStatus,

[company.id]: { status: "accepted", offer: company.ratePerTonne multiplied by tonnes }

});

};



const handleDecline = (company) => {

setRequestStatus({ ...requestStatus, [company.id]: { status: "declined" } });

};



return (



Recycling Value Calculator

Economic case for waste reprocessing



{/* LEFT PANEL /}



WEEKLY INPUT



Tonnes of waste processed this week

setTonnesInput(e.target.value)}

style={{

padding: "12px",

width: "160px",

background: "white",



border: "1px solid #d0d8d0",

borderRadius: "6px",

color: "#1a2a1e",



fontSize: "16px"

}}

/>

Run

QUICK PRESETS

{[1000, 5000, 10000, 25000].map((preset) => (

{ setTonnesInput(String(preset)); setTonnes(preset); setRequestStatus({}); }}

style={{

padding: "8px 14px",

background: "white",

border: "1px solid #d0d8d0",

borderRadius: "6px",

color: "#1a2a1e",

cursor: "pointer",

fontSize: "13px"

}}

>

{preset.toLocaleString()}t

))}

FIXED INDUSTRY ASSUMPTIONS 🔒

Gold per tonne is 0.1 g/t.

Gold price: R1,400/g

Bricks per tonne: 30

Brick price is R2.50.

Capacity per job: 180 t/job/week

{/ RIGHT PANEL /}

RESULTS

💰 GOLD VALUE RECOVERED

{formatR(goldValue)}

{goldGrams} grams Au

🧱 BRICKS PRODUCED

{bricks.toLocaleString()}

approximately equal in value to {Math.round(bricks / 2000)} houses

👷 JOBS CREATED

{jobs}

1 job per 180 tonnes

💎 TOTAL ECONOMIC VALUE

{formatR(totalValue)}

{formatR(Math.round(totalValue / tonnes))} per tonne

MATCHED RECYCLING REQUESTS FOR THIS WEEK

The following proposals have been submitted by these companies based on your {tonnes.toLocaleString()} tonnes:

&& (matchedCompanies.length === 0)

At the moment there are no offers for this tonnage so try a different quantity.

)}



{matchedCompanies.map((company) => {

const status = requestStatus[company.id];

const offerValue = company.ratePerTonne tonnes;

return (

{company.name}

Wants: {company.minTonnes.toLocaleString()} to {company.maxTonnes.toLocaleString()} tonnes of {company.request}

OFFER:

{formatR(offerValue)}

(R{company.ratePerTonne} per tonne × {tonnes.toLocaleString()} tonnes)

{status?.status === "accepted" && (

The offer has been accepted at {formatR(status.offer)}. The company has been informed and will get in touch with you within 24 hours to arrange the collection.

)}

{status?.status === "declined" && (

The offer has been rejected. {company.name} has been informed.

)}

{!status && (

<>

handleAccept(company)}

style={{ padding: "8px 20px", background: "#2e7d5b", color: "white", border: "none", borderRadius: "6px", marginRight: "10px", cursor: "pointer" }}

>

ACCEPT

handleDecline(company)}

style={{ padding: "8px 20px", background: "#c0392b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}

>

DECLINE

</>

)}

);

})}

);

}



export default Calculator;

Want a second op
