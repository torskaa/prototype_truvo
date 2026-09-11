import React, { useEffect, useRef, useState } from 'react';
import { Link, X } from 'lucide-react';
import type { Broker } from '../types';
import { useRewards } from '../features/rewards/RewardProvider';
import type { ActionResult } from '../features/rewards/economy';

interface ConnectBrokerModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokers: Broker[];
  selectedBroker: Broker | null;
  onSuccess: (brokerId: string, accountId: string) => ActionResult;
  contextSymbol?: string;
}

export const ConnectBrokerModal: React.FC<ConnectBrokerModalProps> = ({
  isOpen, onClose, brokers, selectedBroker, onSuccess, contextSymbol,
}) => {
  const { snapshot } = useRewards();
  const [brokerId, setBrokerId] = useState('');
  const [accountId, setAccountId] = useState('DEMO-1234');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const accountInput = useRef<HTMLInputElement>(null);
  const initialBrokerId = selectedBroker?.id ?? brokers[0]?.id ?? '';
  const connectionRef = useRef(snapshot.connections);
  connectionRef.current = snapshot.connections;

  useEffect(() => {
    if (isOpen) {
      setBrokerId(initialBrokerId);
      setAccountId(connectionRef.current.find(item => item.brokerId === initialBrokerId)?.accountId ?? 'DEMO-1234');
      setError('');
      setSubmitted(false);
      if (!dialog.current?.open) dialog.current?.showModal();
    } else if (dialog.current?.open) dialog.current.close();
  }, [isOpen, initialBrokerId]);

  const changeBroker = (id: string) => {
    setBrokerId(id);
    setAccountId(snapshot.connections.find(item => item.brokerId === id)?.accountId ?? 'DEMO-1234');
    setError('');
    setSubmitted(false);
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!brokers.some(broker => broker.id === brokerId)) {
      setError('Choose an available broker.');
      return;
    }
    if (!/^DEMO-[a-z0-9-]{1,40}$/i.test(accountId.trim())) {
      setError('Enter a valid account identifier.');
      accountInput.current?.focus();
      return;
    }
    setError('');
    try {
      const result = onSuccess(brokerId, accountId.trim());
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage(result.message);
      setSubmitted(true);
    } catch {
      setError('The connection could not be saved. Please try again.');
    }
  };

  return <dialog ref={dialog} onCancel={onClose} onClose={onClose} aria-labelledby="broker-title" aria-describedby="broker-description" className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-0 text-[#0b1c30] shadow-2xl backdrop:bg-slate-900/60">
    <header className="flex items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 p-5"><div className="flex items-center gap-3"><span className="rounded-xl bg-[#5338ec] p-2 text-[#c6f831]"><Link className="h-5 w-5" /></span><div><h2 id="broker-title" className="text-lg font-bold">Manage connection</h2><p className="mt-1 text-xs text-slate-500">Account connection</p></div></div><button autoFocus onClick={onClose} aria-label="Close broker connection" className="rounded-lg p-1.5 hover:bg-slate-200"><X className="h-5 w-5" /></button></header>
    <form onSubmit={submit} className="space-y-4 p-6">
      {contextSymbol && <p className="rounded-lg bg-purple-50 p-3 text-sm font-semibold text-[#5338ec]">Research context: {contextSymbol}. Close to return to your research.</p>}
      <p id="broker-description" className="text-sm leading-relaxed text-slate-600">Connect your broker account to compare conditions and manage access.</p>
      {error && <p id="broker-error" role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {submitted && <p role="status" className="rounded-xl bg-lime-50 p-3 text-sm text-lime-900">{message} Reward: 0 Points, 0 Credits.</p>}
      <div><label htmlFor="broker-select" className="mb-2 block text-sm font-semibold">Broker</label><select id="broker-select" value={brokerId} onChange={event => changeBroker(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm">{brokers.length === 0 && <option value="">No brokers available</option>}{brokers.map(broker => <option key={broker.id} value={broker.id}>{broker.name}</option>)}</select></div>
      <div><label htmlFor="broker-account" className="mb-2 block text-sm font-semibold">Account ID</label><input ref={accountInput} id="broker-account" type="text" autoComplete="off" spellCheck={false} value={accountId} onChange={event => { setAccountId(event.target.value); setSubmitted(false); setError(''); }} placeholder="Account ID" maxLength={45} aria-invalid={!!error} aria-describedby={error ? 'broker-account-help broker-error' : 'broker-account-help'} className="w-full rounded-xl border border-slate-300 p-3 text-sm" /><p id="broker-account-help" className="mt-2 text-xs text-slate-500">Reconnecting updates this broker account.</p></div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Close</button><button type="submit" disabled={brokers.length === 0 || submitted} className="rounded-xl bg-[#5338ec] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#4338ca] disabled:opacity-50">{submitted ? 'Submitted' : 'Connect account'}</button></div>
    </form>
  </dialog>;
};
