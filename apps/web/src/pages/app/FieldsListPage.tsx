import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Tractor, Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FieldDTO, FarmDTO } from '@dhara/shared';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';

export const FieldsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeOrganization } = useAuth();
  const [farms, setFarms] = useState<FarmDTO[]>([]);
  const [fieldsMap, setFieldsMap] = useState<{ [farmId: string]: FieldDTO[] }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAllFields() {
      setIsLoading(true);
      try {
        const farmList = await apiClient.getFarms(activeOrganization?.id);
        setFarms(farmList);
        const map: { [farmId: string]: FieldDTO[] } = {};
        for (const farm of farmList) {
          const fList = await apiClient.getFieldsForFarm(farm.id);
          map[farm.id] = fList;
        }
        setFieldsMap(map);
      } catch {
        setFarms([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadAllFields();
  }, [activeOrganization?.id]);

  const allFields = Object.values(fieldsMap).flat();

  const filteredFields = allFields.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.soilType && f.soilType.toLowerCase().includes(searchQuery.toLowerCase())),
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
                  <Grid className="h-6 w-6 text-cyan-400" />
                  <span>Land Fields Directory</span>
                </h1>
                <p className="text-xs text-slate-400">
                  Land parcels, soil boundaries, and production blocks across all farms
                </p>
              </div>

              <Button
                onClick={() => navigate('/app/farms')}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs space-x-1.5 self-start sm:self-auto"
              >
                <Tractor className="h-4 w-4" />
                <span>Go to Farms to Add Field</span>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search fields by name or soil type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dhara-surface border border-dhara-surfaceBorder rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Fields List */}
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                Loading land fields from database...
              </div>
            ) : filteredFields.length === 0 ? (
              <div className="p-12 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface text-center space-y-4">
                <Grid className="h-10 w-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-200">No Land Fields Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Select a farm facility to create and manage land field boundaries.
                </p>
                <Button
                  onClick={() => navigate('/app/farms')}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  View Farm Facilities
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFields.map((field) => {
                  const parentFarm = farms.find((farm) => farm.id === field.farmId);
                  return (
                    <div
                      key={field.id}
                      onClick={() => navigate(`/app/fields/${field.id}`)}
                      className="p-5 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface hover:border-cyan-500/40 transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="border-cyan-500/30 text-cyan-400 font-mono text-[9px]"
                        >
                          FIELD PARCEL
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Soil: {field.soilType || 'Loam'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {field.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Farm: {parentFarm?.name || field.farmId}
                        </p>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {field.description || 'No description.'}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>Area: {field.area ? `${field.area} ${field.areaUnit}` : 'N/A'}</span>
                        <span className="text-cyan-400 text-[11px] font-sans font-semibold">
                          View Zones →
                        </span>
                      </div>
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
