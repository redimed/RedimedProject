//
//  rtelehealthViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 24/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rtelehealthViewController.h"

@interface rtelehealthViewController ()

@end

@implementation rtelehealthViewController
@synthesize webview;
@synthesize busy;

- (void) webloading{
    if (!webview.loading){
        //[busy stopAnimating];
         busy.hidden = true;
    }else{
        //[busy startAnimating];
        busy.hidden = false;
    }
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    //[webview addSubview:busy];
    [webview loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://mynote.net.au/telehealth"]]];
    timer = [NSTimer scheduledTimerWithTimeInterval:(1.0/2.0) target:self selector:@selector(webloading) userInfo:nil repeats:YES];
    
}



- (BOOL) webView: (UIWebView*)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType{
    NSURL *url = request.URL;
    NSString *urlString = url.absoluteString;
    NSLog(@"urlString: %@", urlString);
    return YES;
    
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    if (UIInterfaceOrientationIsLandscape(interfaceOrientation)) {
        return YES;
    }
    return NO;
}

@end
