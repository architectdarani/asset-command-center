import { Link } from "@tanstack/react-router";
import { Td, Th, TableWrap, Tag } from "./ui";
import { type Asset, kes, pct, noi, yieldPct, equity } from "@/lib/redm-data";

export function PortfolioAssetTable({ assets }: { assets: Asset[] }) {
  return (
    <TableWrap>
      <thead>
        <tr>
          <Th>Asset</Th>
          <Th>Location</Th>
          <Th>Class</Th>
          <Th>Lifecycle</Th>
          <Th>Strategy</Th>
          <Th right>Acq. Value</Th>
          <Th right>Current Value</Th>
          <Th right>Invested</Th>
          <Th right>Debt</Th>
          <Th right>Equity</Th>
          <Th right>Revenue</Th>
          <Th right>NOI</Th>
          <Th right>Yield</Th>
          <Th right>IRR</Th>
          <Th right>ROI</Th>
          <Th right>Occ.</Th>
          <Th>Risk</Th>
        </tr>
      </thead>
      <tbody>
        {assets.map((a) => (
          <tr key={a.id} className="group hover:bg-surface-2">
            <Td>
              <Link
                to="/assets/$assetId"
                params={{ assetId: a.id }}
                className="text-foreground underline-offset-2 hover:text-primary hover:underline"
              >
                {a.name}
              </Link>
              <div className="num text-[10px] text-muted-foreground">{a.id}</div>
            </Td>
            <Td className="text-muted-foreground">{a.location}</Td>
            <Td className="text-muted-foreground">{a.assetClass}</Td>
            <Td>
              <Tag tone="info">{a.lifecycle}</Tag>
            </Td>
            <Td>
              <Tag tone="signal">{a.strategy}</Tag>
            </Td>
            <Td right mono>{kes(a.acquisitionValue)}</Td>
            <Td right mono className="text-foreground">{kes(a.currentValue)}</Td>
            <Td right mono>{kes(a.investedCapital)}</Td>
            <Td right mono>{kes(a.debt)}</Td>
            <Td right mono>{kes(equity(a))}</Td>
            <Td right mono>{kes(a.revenue)}</Td>
            <Td right mono>{kes(noi(a))}</Td>
            <Td right mono>{pct(yieldPct(a))}</Td>
            <Td right mono className="text-primary">{pct(a.projectedIrr)}</Td>
            <Td right mono>{pct(a.roi)}</Td>
            <Td right mono>{a.occupancy}%</Td>
            <Td>
              <Tag tone="risk">{a.risk}</Tag>
            </Td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}
