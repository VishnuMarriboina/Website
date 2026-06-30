import { useServiceAHealth } from '../hooks/useServiceA';
import { useServiceBHealth } from '../hooks/useServiceB';
import type { ServiceDotProps } from './types';

function ServiceDot({ name, port, data, isLoading, isError }: ServiceDotProps) {
  const dot = isLoading
    ? 'bg-yellow-400 animate-pulse'
    : isError
    ? 'bg-red-500'
    : 'bg-green-500';

  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${dot}`} />
      <span className="text-sm font-mono text-slate-300">
        {name}
        <span className="text-slate-500 ml-1">:{port}</span>
      </span>
      {data && (
        <span className="text-xs text-slate-400 ml-1">({data.status})</span>
      )}
    </div>
  );
}

export default function GrpcStatus() {
  const a = useServiceAHealth();
  const b = useServiceBHealth();

  return (
    <div className="flex items-center gap-6 bg-slate-800 px-5 py-2 rounded-xl text-xs w-fit mx-auto mt-3 mb-1 shadow">
      <span className="text-slate-400 font-semibold tracking-wide uppercase text-[10px]">gRPC Backend</span>
      <ServiceDot name="service-a" port={50051} data={a.data} isLoading={a.isLoading} isError={a.isError} />
      <ServiceDot name="service-b" port={50052} data={b.data} isLoading={b.isLoading} isError={b.isError} />
      <span className="text-slate-500 text-[10px]">via proxy :8080</span>
    </div>
  );
}
