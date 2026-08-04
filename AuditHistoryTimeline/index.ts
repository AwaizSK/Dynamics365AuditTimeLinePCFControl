

import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { AuditTimelineComponent, IAuditTimelineProps } from "./src/components/AuditTimeLineComponent";

export class AuditHistoryTimeline implements ComponentFramework.ReactControl<IInputs, IOutputs> {

    constructor() {
        // Empty constructor
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        // No manual initialization needed for ReactControl
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const props: IAuditTimelineProps = { context };
        return React.createElement(AuditTimelineComponent, props);
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // Cleanup if necessary
    }
}