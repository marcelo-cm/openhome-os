import { getLocation } from '@openhome-os/core/models/location/location-actions';

import LocationView from './_layers/location-view';

const LocationPage = async ({
  params,
}: PageProps<'/system/location/[location_id]'>) => {
  const { location_id: locationId } = await params;

  const location = await getLocation({ id: locationId });

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <LocationView location={location} />
    </main>
  );
};

export default LocationPage;
