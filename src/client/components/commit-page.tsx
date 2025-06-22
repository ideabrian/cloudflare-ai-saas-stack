import { useState } from "react";

type Commitment = {
  label: string;
  value: number;
};

export default function CommitPage() {
  const [agreed, setAgreed] = useState<Commitment[]>([]);
  const [custom, setCustom] = useState("");
  const [committed, setCommitted] = useState(false);

  const options = [
    { label: "I’ll show up weekly to build something", value: 5 },
    { label: "I’ll give feedback when asked", value: 5 },
    { label: "I’ll record a call with someone new", value: 5 },
    { label: "I’ll nominate a builder I trust", value: 5 },
    { label: "I’ll help another builder get unstuck", value: 5 }
  ];

  const total = agreed.reduce((acc, item) => acc + item.value, 0);
  const eligible = total >= 20;

  const handleToggle = (label: string, value: number) => {
    const exists = agreed.find((item) => item.label === label);
    if (exists) {
      setAgreed(agreed.filter((item) => item.label !== label));
    } else {
      setAgreed([...agreed, { label, value }]);
    }
  };

  const submitCommitment = async () => {
    setCommitted(true);
    // TODO: send to backend and generate Stripe link if eligible
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow font-mono text-gray-800">
      <h2 className="text-2xl font-bold mb-4">🧾 Your Builder Commitments</h2>
      <p className="mb-6">Check everything you’d be willing to consider. Once your total intent reaches $20 or more, we’ll unlock the path in.</p>

      <ul className="mb-4">
        {options.map((opt) => (
          <li key={opt.label} className="mb-2">
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={!!agreed.find((a) => a.label === opt.label)}
                onChange={() => handleToggle(opt.label, opt.value)}
              />
              <span>{opt.label} (${opt.value})</span>
            </label>
          </li>
        ))}
      </ul>

      <div className="mb-6">
        <label htmlFor="custom-input" className="block text-sm mb-1">Add your own</label>
        <input
          id="custom-input"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="I’ll share it with 3 people I admire..."
          className="w-full p-2 border border-gray-200 rounded"
        />
      </div>

      <p className="text-md font-semibold mb-4">💰 Total Intent: ${total}</p>

      {committed ? (
        eligible ? (
          <div className="bg-green-100 text-green-800 p-4 rounded">
            ✅ Great! We’ll now generate a private link to join. Check your inbox or DMs soon.
          </div>
        ) : (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded">
            Thanks! You’re on the list. We’ll reach out once we open more seats.
          </div>
        )
      ) : (
        <button
          type="button"
          onClick={submitCommitment}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
        >
          {eligible ? "👉 Commit & Join" : "🙋 Submit & Waitlist Me"}
        </button>
      )}
    </div>
  );
}
