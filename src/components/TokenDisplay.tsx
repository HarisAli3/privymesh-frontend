import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Eye, EyeOff, Download } from 'lucide-react';
import zitadelAuth from '@/lib/zitadel-auth';

export default function TokenDisplay() {
  const [copied, setCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const token = zitadelAuth.getAccessToken();
  const currentUser = zitadelAuth.getCurrentUser();

  const handleCopy = async () => {
    if (token) {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!token) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `access-token-${timestamp}.txt`;
    
    // Create a blob with the token
    const blob = new Blob([token], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatToken = (token: string | null) => {
    if (!token) return 'No token available';
    if (token.length > 100) {
      return showToken 
        ? token 
        : `${token.substring(0, 50)}...${token.substring(token.length - 20)}`;
    }
    return showToken ? token : '•'.repeat(token.length);
  };

  const decodeToken = (token: string | null) => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      return null;
    }
  };

  const tokenPayload = decodeToken(token);
  const isExpired = currentUser?.expired ?? true;

  return (
    <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🔑 Token Display (Temporary)</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowToken(!showToken)}
              className="h-8"
              title={showToken ? 'Hide token' : 'Show token'}
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!token}
              className="h-8"
              title="Copy token to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!token}
              className="h-8"
              title="Download full token as file"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Current access token for debugging purposes
          {isExpired && <span className="text-red-600 dark:text-red-400 ml-2">(Expired)</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Access Token:
          </label>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
            <code className="text-xs break-all font-mono text-gray-900 dark:text-gray-100">
              {formatToken(token)}
            </code>
          </div>
          {token && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Length: {token.length} characters
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-7 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Download Full Token
              </Button>
            </div>
          )}
        </div>

        {tokenPayload && (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Token Payload (Decoded):
            </label>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
              <pre className="text-xs font-mono text-gray-900 dark:text-gray-100">
                {JSON.stringify(tokenPayload, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {currentUser && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Expires:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">
                {(currentUser as any).expires_at 
                  ? new Date((currentUser as any).expires_at * 1000).toLocaleString()
                  : (currentUser as any).expires_in
                  ? `In ${(currentUser as any).expires_in} seconds`
                  : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Token Type:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">
                {(currentUser as any).token_type || 'Bearer'}
              </span>
            </div>
          </div>
        )}

        {!token && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              ⚠️ No token available. User may not be authenticated.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

