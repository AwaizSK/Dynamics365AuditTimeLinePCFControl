import * as React from "react";
import { ActivityItem, Icon, Link, Spinner, SpinnerSize } from "@fluentui/react";
import { IInputs } from "../../generated/ManifestTypes";

export interface IAuditTimelineProps {
  context: ComponentFramework.Context<IInputs>;
}

interface IAuditRecord {
  id: string;
  createdOn: string;
  userName: string;
  actionName: string;
  operation: string;
}

export const AuditTimelineComponent: React.FC<IAuditTimelineProps> = ({ context }) => {
  const [audits, setAudits] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAuditHistory = async () => {
      try {
        // Retrieve current record ID and Entity Logical Name from Page Context
        const pageContext = (context as unknown as { page: { entityId: string; entityTypeName: string } }).page;
        if (!pageContext || !pageContext.entityId) {
          setLoading(false);
          return;
        }

        const recordId = pageContext.entityId.replace("{", "").replace("}", "");
        const filter = `?$filter=_objectid_value eq ${recordId}&$orderby=createdon desc&$top=20`;

        const response = await context.webAPI.retrieveMultipleRecords("audit", filter);
        
        const parsedAudits: IAuditRecord[] = response.entities.map((entity) => ({
          id: entity.auditid,
          createdOn: new Date(entity.createdon).toLocaleString(),
          userName: entity["_userid_value@OData.Community.Display.V1.FormattedValue"] || "System",
          actionName: entity["action@OData.Community.Display.V1.FormattedValue"] || "Update",
          operation: entity["operation@OData.Community.Display.V1.FormattedValue"] || "Change",
        }));

        setAudits(parsedAudits);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditHistory();
  }, [context]);

  if (loading) return <Spinner size={SpinnerSize.medium} label="Loading audit history..." />;
  if (audits.length === 0) return <div>No audit history found for this record.</div>;

  return (
    <div>
      {audits.map((item) => (
        <ActivityItem
          key={item.id}
          activityDescription={[
            <Link key={item.id + "-user"}>{item.userName}</Link>,
            <span key={item.id + "-action"}>
              {" "}
              performed {item.actionName} ({item.operation})
            </span>,
          ]}
          timeStamp={item.createdOn}
          activityIcon={<Icon iconName="History" />}
          style={{ marginBottom: "12px" }}
        />
      ))}
    </div>
  );
};