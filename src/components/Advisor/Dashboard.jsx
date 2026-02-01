import VehicleSelector from './VehicleSelector';
import MaintenanceSelector from './MaintenanceSelector';
import CostSummary from './CostSummary';
import DetailList from './DetailList';
import './Advisor.css';

export default function AdvisorDashboard() {
    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div className="flex flex-col gap-md">
                <VehicleSelector />
                <MaintenanceSelector />

                <CostSummary />

                <DetailList />
            </div>
        </div>
    );
}
