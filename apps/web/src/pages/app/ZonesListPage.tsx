import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Grid, Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ZoneDTO, FieldDTO } from '@dhara/shared';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';

export const ZonesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeOrganization } = useAuth();
  const [zones, setZones] = useState<ZoneDTO[]>([]);
  const [fields, setFields] = useState<FieldDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAllZones() {
      setIsLoading(true);
      try {
        const farmList = await apiClient.getFarms(activeOrganization?.id);
        const allFieldsList: FieldDTO[] = [];
        const allZonesList: ZoneDTO[] = [];

        for (const farm of farmList) {
          const fList = await apiClient.getFieldsForFarm(farm.id);
          allFieldsList.push(...fList);
          for (const field of fList) {
            const zList = await apiClient.getZonesForField(field.id);
            allZonesList.push(...zList);
          }
        }

        setFields(allFieldsList);
        setZones(allZonesList);
      } catch {
        setZones([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadAllZones();
  }, [activeOrganization?.id]);

  const filteredZones = zones.filter(
    (z) =>
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.irrigationType.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="py-8">
      <Section variant="default">
        <Container>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-2">
                  <Layers className="h-6 w-6 text-purple-400" />
                  <span>Irrigation Zones Directory</span>
                </h1>
                <p className="text-xs text-slate-400">
                  Actuator groups and irrigation blocks across all fields
                </p>
              </div>

              <Button
                onClick={() => navigate('/app/fields')}
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs space-x-1.5 self-start sm:self-auto"
              >
                <Grid className="h-4 w-4" />
                <span>Go to Fields to Add Zone</span>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search zones by name or irrigation type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dhara-surface border border-dhara-surfaceBorder rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Zones List */}
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                Loading irrigation zones from database...
              </div>
            ) : filteredZones.length === 0 ? (
              <div className="p-12 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface text-center space-y-4">
                <Layers className="h-10 w-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-200">
                  No Irrigation Zones Configured
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Select a land field to configure drip, sprinkler, or flood irrigation zones.
                </p>
                <Button
                  onClick={() => navigate('/app/fields')}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  View Land Fields
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredZones.map((zone) => {
                  const parentField = fields.find((f) => f.id === zone.fieldId);
                  return (
                    <div
                      key={zone.id}
                      onClick={() => navigate(`/app/fields/${zone.fieldId}`)}
                      className="p-5 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface hover:border-purple-500/40 transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="border-purple-500/30 text-purple-400 font-mono text-[9px]"
                        >
                          {zone.irrigationType} IRRIGATED
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {zone.area ? `${zone.area} ${zone.areaUnit}` : 'Area N/A'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                          {zone.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Field: {parentField?.name || zone.fieldId}
                        </p>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {zone.description || 'No zone description.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
};
