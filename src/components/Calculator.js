import { useState } from "react";

function Calculator() {
  const [tonnesInput, setTonnesInput] = useState("5000");
  const [tonnes, setTonnes] = useState(5000);

  const [requestStatus, setRequestStatus] = useState({});

 
  const GOLD_PER_TONNE = 0.1;      
  const GOLD_PRICE = 1400;         
  const BRICKS_PER_TONNE = 30;
  const BRICK_PRICE = 2.5;         
  const TONNES_PER_JOB = 180;

  
  const goldGrams = tonnes * GOLD_PER_TONNE;
  const goldValue = goldGrams * GOLD_PRICE;
  const bricks = tonnes * BRICKS_PER_TONNE;
  const brickValue = bricks * BRICK_PRICE;
  const jobs = Math.round(tonnes / TONNES_PER_JOB);
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
      [company.id]: { status: "accepted", offer: company.ratePerTonne * tonnes },
    });
  };

  const handleDecline = (company) => {
    setRequestStatus({ ...requestStatus, [company.id]: { status: "declined" } });
  };

  return (
    <div style={{ background: "#f4f6f8", minHeight: "100vh", padding: "40px 20px", fontFamily: "Arial", color: "#1a2a1e" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <h1 style={{ marginBottom: "8px" }}>Recycling Value Calculator</h1>
        <p style={{ color: "#5a6a5e", marginBottom: "30px" }}>
          Economic case for waste reprocessing
        </p>

        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>

          {/* ===== LEFT PANEL ===== */}
          <div style={{ flex: "1", minWidth: "280px" }}>

            <h3 style={{ color: "#5a6a5e", fontSize: "13px", letterSpacing: "1px" }}>WEEKLY INPUT</h3>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Tonnes of waste processed this week
            </label>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="number"
                value={tonnesInput}
                onChange={(e) => setTonnesInput(e.target.value)}
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
              <button
                onClick={handleRun}
                style={{
                  padding: "12px 28px",
                  background: "#2e7d5b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Run
              </button>
            </div>

            <p style={{ color: "#5a6a5e", fontSize: "12px", marginTop: "20px", marginBottom: "8px" }}>
              QUICK PRESETS
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[1000, 5000, 10000, 25000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => { setTonnesInput(String(preset)); setTonnes(preset); setRequestStatus({}); }}
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
                </button>
              ))}
            </div>

            <h3 style={{ color: "#5a6a5e", fontSize: "13px", letterSpacing: "1px", marginTop: "30px" }}>
              FIXED INDUSTRY ASSUMPTIONS 🔒
            </h3>
            <ul style={{ listStyle: "none", padding: 0, color: "#3a4a3e" }}>
              <li style={{ padding: "6px 0" }}>Gold per tonne: 0.1 g/t</li>
              <li style={{ padding: "6px 0" }}>Gold price: R1,400/g</li>
              <li style={{ padding: "6px 0" }}>Bricks per tonne: 30</li>
              <li style={{ padding: "6px 0" }}>Brick price: R2.50</li>
              <li style={{ padding: "6px 0" }}>Capacity per job: 180 t/job/week</li>
            </ul>
          </div>

          {/* ===== RIGHT PANEL ===== */}
          <div style={{ flex: "2", minWidth: "320px" }}>

            <h3 style={{ color: "#5a6a5e", fontSize: "13px", letterSpacing: "1px" }}>RESULTS</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "10px" }}>

              <div style={{ background: "white", border: "1px solid #e0e6e0", borderRadius: "10px", padding: "20px" }}>
                <p style={{ color: "#5a6a5e", margin: 0, fontSize: "12px", letterSpacing: "1px" }}>💰 GOLD VALUE RECOVERED</p>
                <p style={{ fontSize: "28px", margin: "10px 0", color: "#1a2a1e" }}>{formatR(goldValue)}</p>
                <p style={{ color: "#5a6a5e", margin: 0, fontSize: "13px" }}>{goldGrams} grams Au</p>
              </div>

              <div style={{ background: "white", border: "1px solid #e0e6e0", borderRadius: "10px", padding: "20px" }}>
                <p style={{ color: "#5a6a5e", margin: 0, fontSize: "12px", letterSpacing: "1px" }}>🧱 BRICKS PRODUCED</p>
                <p style={{ fontSize: "28px", margin: "10px 0", color: "#1a2a1e" }}>{bricks.toLocaleString()}</p>
                <p style={{ color: "#5a6a5e", margin: 0, fontSize: "13px" }}>≈ {Math.round(bricks / 2000)} houses worth</p>
              </div>

              <div style={{ background: "white", border: "1px solid #e0e6e0", borderRadius: "10px", padding: "20px" }}>
                <p style={{ color: "#5a6a5e", margin: 0, fontSize: "12px", letterSpacing: "1px" }}>👷 JOBS CREATED</p>
                <p style={{ fontSize: "28px", margin: "10px 0", color: "#1a2a1e" }}>{jobs}</p>
                <p style={{ color: "#5a6a5e", margin: 0, fontSize: "13px" }}>1 job per 180 tonnes</p>
              </div>

              <div style={{ background: "#1a2a1e", border: "1px solid #1a2a1e", borderRadius: "10px", padding: "20px" }}>
                <p style={{ color: "#8fa38f", margin: 0, fontSize: "12px", letterSpacing: "1px" }}>💎 TOTAL ECONOMIC VALUE</p>
                <p style={{ fontSize: "28px", margin: "10px 0", color: "white" }}>{formatR(totalValue)}</p>
                <p style={{ color: "#8fa38f", margin: 0, fontSize: "13px" }}>{formatR(Math.round(totalValue / tonnes))} per tonne</p>
              </div>

            </div>

            <h3 style={{ color: "#5a6a5e", fontSize: "13px", letterSpacing: "1px", marginTop: "40px" }}>
              MATCHED RECYCLING REQUESTS FOR THIS WEEK
            </h3>
            <p style={{ color: "#5a6a5e", fontSize: "14px" }}>
              Based on your {tonnes.toLocaleString()} tonnes, these companies have sent offers:
            </p>

            {matchedCompanies.length === 0 && (
              <div style={{ background: "white", border: "1px solid #e0e6e0", borderRadius: "10px", padding: "20px", color: "#5a6a5e" }}>
                No matching offers for this tonnage yet. Try a different amount.
              </div>
            )}

            {matchedCompanies.map((company) => {
              const status = requestStatus[company.id];
              const offerValue = company.ratePerTonne * tonnes;

              return (
                <div key={company.id} style={{ background: "white", border: "1px solid #e0e6e0", borderRadius: "10px", padding: "20px", marginBottom: "15px" }}>
                  <strong>{company.name}</strong>
                  <p style={{ color: "#5a6a5e", margin: "8px 0" }}>
                    Wants: {company.minTonnes.toLocaleString()}–{company.maxTonnes.toLocaleString()} tonnes of {company.request}
                  </p>

                  <div style={{ background: "#f4f6f8", border: "1px solid #e0e6e0", borderRadius: "6px", padding: "10px 15px", margin: "12px 0", display: "inline-block" }}>
                    <span style={{ color: "#5a6a5e", fontSize: "12px" }}>OFFER: </span>
                    <span style={{ color: "#2e7d5b", fontSize: "16px", fontWeight: "bold" }}>
                      {formatR(offerValue)}
                    </span>
                    <span style={{ color: "#5a6a5e", fontSize: "12px" }}>
                      {" "} (R{company.ratePerTonne}/tonne × {tonnes.toLocaleString()}t)
                    </span>
                  </div>

                  {status?.status === "accepted" && (
                    <p style={{ color: "#2e7d5b", margin: "8px 0", fontWeight: "bold" }}>
                      ✅ Offer accepted at {formatR(status.offer)}. {company.name} has been notified and will contact you within 24 hours to arrange collection.
                    </p>
                  )}

                  {status?.status === "declined" && (
                    <p style={{ color: "#c0392b", margin: "8px 0", fontWeight: "bold" }}>
                      ❌ Offer declined. {company.name} has been notified.
                    </p>
                  )}

                  {!status && (
                    <>
                      <button
                        onClick={() => handleAccept(company)}
                        style={{ padding: "8px 20px", background: "#2e7d5b", color: "white", border: "none", borderRadius: "6px", marginRight: "10px", cursor: "pointer" }}
                      >
                        ACCEPT
                      </button>
                      <button
                        onClick={() => handleDecline(company)}
                        style={{ padding: "8px 20px", background: "#c0392b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                      >
                        DECLINE
                      </button>
                    </>
                  )}
                </div>
              );
            })}

          </div>

        </div>

      </div>
    </div>
  );
}

export default Calculator;
