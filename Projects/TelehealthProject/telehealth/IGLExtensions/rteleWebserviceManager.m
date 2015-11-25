//
//  rteleWebserviceManager.m
//  telehealth
//
//  Created by Olivier Voyer on 25/10/2013.
//  Copyright (c) 2013 REDiMED. All rights reserved.
//

#import "rteleWebserviceManager.h"
#import "constants.h"

@interface rteleWebserviceManager ()<NSURLConnectionDelegate>

@end
@implementation rteleWebserviceManager

+(NSURL *) getURL{
//    NSString *stringURL = [[NSUserDefaults standardUserDefaults] valueForKey:@"SERVER_URL"];
//    if (!stringURL) {
//        if ([[NSFileManager defaultManager] fileExistsAtPath:[[NSBundle mainBundle] pathForResource:@"SERVERURL" ofType:@"plist"]]) {
//            NSDictionary *dict = [NSDictionary dictionaryWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"SERVERURL" ofType:@"plist"]];
//            [[NSUserDefaults standardUserDefaults] setValue:[dict valueForKey:@"SERVER_URL"] forKey:@"SERVER_URL"];
//            stringURL = [dict valueForKey:@"SERVER_URL"];
//        }
//    }
//    if (![[NSUserDefaults standardUserDefaults] valueForKey:@"SERVER_URL"]) {
//        [[NSUserDefaults standardUserDefaults] setValue:SITE_URL_IN_STRING forKey:@"SERVER_URL"];
//    }
//    
//    NSURL *urlLink = [NSURL URLWithString:stringURL];
//    if (!urlLink) {
//        stringURL = @"http://telehealth.redimed.com.au/telehealth/index.php/";
//        [[NSUserDefaults standardUserDefaults] setValue:SITE_URL_IN_STRING forKey:@"SERVER_URL"];
//        return [NSURL URLWithString:stringURL];
//    }
//    stringURL = @"http://128.199.192.223/meditek/telehealth/new_webapi/index.php/";
    return [NSURL URLWithString:SITE_URL_IN_STRING];
}


+ (NSString *)sendSynchronousWebserviceRequest:(NSString *)APIcall jsonData:(BOOL) jsonData{
    return [self sendSynchronousWebserviceRequest:APIcall showAlert:NO jsonData:jsonData];
}

+ (NSString *)sendSynchronousWebserviceRequest:(NSString *)APIcall showAlert:(BOOL)showAlert jsonData:(BOOL) jsonData{

    NSMutableURLRequest *request =[NSMutableURLRequest requestWithURL:[NSURL URLWithString:APIcall relativeToURL:[rteleWebserviceManager getURL]]];
    NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
    [request setValue:author_token forHTTPHeaderField:@"Authorization"];
    return [self sendRequest:request showAlert:showAlert jsonData:jsonData];
}

+ (NSString *)sendRequest:(NSMutableURLRequest *)request showAlert:(BOOL)showAlert jsonData:(BOOL) jsonData{
#if LOG_API_REQUESTS
    NSLog(@"Sending API Request %@", request.URL);
#endif
    
    NSURLResponse *response;
    NSError *err;
    NSData *responseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&err];
    
    NSString *retval = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
    
    if (showAlert) {
        if ([retval isEqualToString:@"1"]) {
            [self showAlert];
        } else {
            NSLog(@"API Request return value: %@", retval);
            [self showAlertError];
#if DEBUG
            [self showHTMLErrorPopup:retval];
#endif
        }
    }
    return retval;
}

+ (NSString *)sendSynchronousWebserviceRequest:(NSString *)APIcall {
    return [self sendSynchronousWebserviceRequest:APIcall showAlert:NO];
}

+ (NSString *)sendSynchronousWebserviceRequest:(NSString *)APIcall showAlert:(BOOL)showAlert {
    NSMutableURLRequest *request =[NSMutableURLRequest requestWithURL:[NSURL URLWithString:APIcall relativeToURL:[rteleWebserviceManager getURL]]];
    NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
    [request setValue:author_token forHTTPHeaderField:@"Authorization"];
    return [self sendRequest:request showAlert:showAlert];
}

+ (NSString *)sendPOSTSynchronousWebserviceRequest:(NSString *)APIcall postData:(NSString *)postDataInString {
    return [self sendPOSTSynchronousWebserviceRequest:APIcall postData:postDataInString showAlert:NO];
}

+ (NSString *)sendPOSTDataSynchronousWebserviceRequest:(NSString *)APIcall postData:(NSData *)postData{

    NSMutableURLRequest *request =[NSMutableURLRequest requestWithURL:[NSURL URLWithString:APIcall relativeToURL:[rteleWebserviceManager getURL]]];
    [request setHTTPMethod:@"POST"];
    NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
    [request setValue:author_token forHTTPHeaderField:@"Authorization"];
    if ([postData length] > 0) {
        [request setHTTPBody:postData];
        [request setValue:[NSString stringWithFormat:@"%lu", (unsigned long)[postData length]] forHTTPHeaderField:@"Content-Length"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    }
    return [self sendRequest:request showAlert:NO];
}
+ (NSString *)sendPOSTSynchronousWebserviceRequest:(NSString *)APIcall postData:(NSString *)postDataInString showAlert:(BOOL)showAlert {
    NSLog(@"--%@--", APIcall);
    NSURL *url = [rteleWebserviceManager getURL];
    NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
    NSMutableURLRequest *request =[NSMutableURLRequest requestWithURL:[NSURL URLWithString:APIcall relativeToURL:url]];
    [request setTimeoutInterval:5*60];
    [request setHTTPMethod:@"POST"];
    if ([postDataInString length] > 0) {
        NSData *postData = [postDataInString dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
        [request setHTTPBody:postData];
        [request setValue:[NSString stringWithFormat:@"%lu", (unsigned long)[postData length]] forHTTPHeaderField:@"Content-Length"];
        [request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
        [request setValue:author_token forHTTPHeaderField:@"Authorization"];
    }
    
    return [self sendRequest:request showAlert:showAlert];
}

+ (NSString *)sendRequest:(NSMutableURLRequest *)request showAlert:(BOOL)showAlert {
#if LOG_API_REQUESTS
    NSLog(@"Sending API Request %@", request.URL);
#endif
    
    NSURLResponse *response;
    NSError *err;

    NSData *responseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&err];
    
//    NSURLConnection *urlConnection = [NSURLConnection connectionWithRequest:request delegate:self];
    NSString *retval = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
//    NSString *retval = @"";
    if ([retval componentsSeparatedByString:@"<!DOCTYPE html>"].count > 1) {
        [[NSNotificationCenter defaultCenter] postNotificationName:@"signout" object:nil];
        return nil;
    }
    if (err) {
        if (err.code == -1001) {
            NSString *url = [[NSUserDefaults standardUserDefaults] valueForKey:@"SERVER_URL"];
            [url stringByReplacingOccurrencesOfString:@"https" withString:@"http"];
            [[NSUserDefaults standardUserDefaults] setValue:url forKey:@"SERVER_URL"];
            //request time out
            [[[UIAlertView alloc] initWithTitle:@"Error!" message:@"The request timed out.\nPlease try again." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
            return nil;
        }
    }
    
    if (showAlert) {
        if (![retval isEqualToString:@"0"]) {
            if ([retval integerValue] > 0) {
                [self showAlert];
            }
        } else {
            NSLog(@"API Request return value: %@", retval);
            [self showAlertError];
#if DEBUG
            [self showHTMLErrorPopup:retval];
#endif
        }
    }
    return retval;
}


+(void)showAlert{
    NSString *alertString = [NSString stringWithFormat:@"Updated successfully."];
	UIAlertView *alert = [[UIAlertView alloc] initWithTitle:alertString message:@"" delegate:nil cancelButtonTitle:@"Done" otherButtonTitles:nil];
	[alert show];
}
+(void)showAlertError{
    NSString *alertString = [NSString stringWithFormat:@"An error has occurred, please turn the ipad wi-fi off and on again then re-submit your request."];
	UIAlertView *alert = [[UIAlertView alloc] initWithTitle:alertString message:@"" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
	[alert show];
}

#if DEBUG
+(void)showHTMLErrorPopup:(NSString *)retval {
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"DEBUG - HTML Error" message:retval delegate:self cancelButtonTitle:nil otherButtonTitles:@"Ok", nil];
    [alert setTag:(NSInteger)46568771783];
    UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectMake(0,0,0,0)];
    [webView setTag:(NSInteger)53434694684];
    [webView loadHTMLString:retval baseURL:nil];
    [alert addSubview:webView];
    [alert show];
}
+ (void)willPresentAlertView:(UIAlertView *)alertView {
    if ([alertView tag] == (NSInteger)46568771783) {
        UIView *viewToReplace = nil;
        for (UIView *subview in alertView.subviews)
            if ([subview class] == NSClassFromString(@"UIAlertTextView")) {
                viewToReplace = subview;
                break;
            }
        if (viewToReplace) {
            UIView *webView = [alertView viewWithTag:(NSInteger)53434694684];
            [webView setFrame:viewToReplace.frame];
            [viewToReplace.superview addSubview:webView];
        }
    }
}
#endif


- (void)connection:(NSURLConnection *)connection
willSendRequestForAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
    
    if([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust])
    {
        NSLog(@"Ignoring SSL");
        SecTrustRef trust = challenge.protectionSpace.serverTrust;
        NSURLCredential *cred;
        cred = [NSURLCredential credentialForTrust:trust];
        [challenge.sender useCredential:cred forAuthenticationChallenge:challenge];
        return;
    }
}


- (BOOL)connection:(NSURLConnection *)connection canAuthenticateAgainstProtectionSpace:(NSURLProtectionSpace *)protectionSpace {
    return [protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust];
}

- (void)connection:(NSURLConnection *)connection didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
    [challenge.sender useCredential:[NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust] forAuthenticationChallenge:challenge];
    [challenge.sender continueWithoutCredentialForAuthenticationChallenge:challenge];
}

@end
