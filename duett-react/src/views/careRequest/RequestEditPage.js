import React, { useCallback, useEffect, useState } from 'react';
import { useRoute } from 'wouter';

import useCareRequestStore from '../../store/careRequests';
import RequestForm from './RequestForm';

const RequestEditPage = () => {
  const [loadRequest, detailRequest] = useCareRequestStore((store) => [
    store.loadDetailRequest,
    store.detailRequest,
  ]);
  const [, params] = useRoute('/request/edit/:id');
  const [requestLoading, setRequestLoading] = useState(!!params?.id);

  const loadPatientRequest = useCallback(async () => {
    if (params?.id) {
      try {
        await loadRequest(params.id);
        setRequestLoading(false);
      } catch (e) {
        alert('Could not load patient request.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) {
      loadPatientRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  return (
    <RequestForm
      requestLoading={requestLoading}
      detailRequest={detailRequest}
      requestId={params?.id}
    />
  );
};

export default RequestEditPage;
