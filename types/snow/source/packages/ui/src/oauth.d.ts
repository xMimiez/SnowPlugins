export declare function dismissOAuth2Modal(): any;
/**
 * `callback` gets the redirect location once the user authorizes. On failure
 * it has to close the modal itself with dismissOAuth2Modal.
 */
export declare function showOAuth2Modal({ clientId, redirectUri, scopes, callback, }: {
    clientId: string;
    redirectUri: string;
    scopes?: string[];
    callback: (args: {
        location: string;
    }) => void | Promise<void>;
}): any;
